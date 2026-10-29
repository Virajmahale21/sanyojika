import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { recordAuditLog } from '../middleware/audit';
import { NotificationService } from '../services/notificationService';
import { DelayRiskEngine } from '../services/riskEngine';

export const getApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const { status, type, academicYear, search } = req.query;

    const where: any = {};

    // Role-based scoping: Institution admins only see their own
    if (user?.role === 'INSTITUTION_ADMIN' && user.institutionId) {
      where.institutionId = user.institutionId;
    }

    if (status && typeof status === 'string' && status !== 'ALL') {
      where.status = status;
    }

    if (type && typeof type === 'string' && type !== 'ALL') {
      where.applicationType = type;
    }

    if (academicYear && typeof academicYear === 'string') {
      where.academicYear = academicYear;
    }

    if (search && typeof search === 'string') {
      where.OR = [
        { applicationNumber: { contains: search } },
        { institution: { name: { contains: search } } },
        { institution: { permanentId: { contains: search } } },
      ];
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        institution: {
          select: {
            id: true,
            permanentId: true,
            name: true,
            nameHi: true,
            nameMr: true,
            category: true,
            city: true,
            state: true,
          },
        },
        assignedOfficer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
        courses: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve application records.' });
  }
};

export const getApplicationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        institution: {
          include: {
            region: true,
          },
        },
        assignedOfficer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            designation: true,
          },
        },
        courses: true,
        documents: {
          include: {
            ocrData: true,
          },
          orderBy: { uploadedAt: 'desc' },
        },
        inspections: {
          include: {
            committeeMembers: {
              include: {
                user: {
                  select: { id: true, fullName: true, designation: true, email: true },
                },
              },
            },
            checklists: true,
          },
        },
        tasks: {
          orderBy: { dueDate: 'asc' },
        },
      },
    });

    if (!application) {
      res.status(404).json({ success: false, message: 'Application record not found.' });
      return;
    }

    // Role check: Institution admins can only view their own institute's application
    if (user?.role === 'INSTITUTION_ADMIN' && user.institutionId !== application.institutionId) {
      res.status(403).json({ success: false, message: 'Access denied for this application record.' });
      return;
    }

    // Fetch related audit logs for the timeline
    const auditLogs = await prisma.auditLog.findMany({
      where: { entityId: id },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: {
        ...application,
        auditLogs,
      },
    });
  } catch (error) {
    console.error('Error fetching application detail:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve application details.' });
  }
};

export const createApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user || user.role !== 'INSTITUTION_ADMIN' || !user.institutionId) {
      res.status(403).json({
        success: false,
        message: 'Only registered Institutional Administrators can initiate approval applications.',
      });
      return;
    }

    const { applicationType, academicYear, courses, submitImmediately } = req.body;

    const year = academicYear || '2026-2027';
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const appNumber = `AICTE/${year}/APP-${randomSeq}`;

    const now = new Date();
    const targetDueDate = new Date(now.getTime() + 45 * 86400000); // 45-day statutory SLA

    const status = submitImmediately ? 'SUBMITTED' : 'DRAFT';
    const currentStageCode = submitImmediately ? 'STAGE_VALIDATION' : 'STAGE_SUBMISSION';

    const newApp = await prisma.application.create({
      data: {
        applicationNumber: appNumber,
        institutionId: user.institutionId,
        applicationType: applicationType || 'EOA',
        academicYear: year,
        status,
        currentStageCode,
        submissionDate: submitImmediately ? now : null,
        targetDueDate,
        delayRiskScore: 15,
        delayRiskLevel: 'LOW',
        delayRiskReasons: JSON.stringify(['Application newly registered in system']),
      },
    });

    // Create courses if provided
    if (Array.isArray(courses) && courses.length > 0) {
      await prisma.applicationCourse.createMany({
        data: courses.map((c: any) => ({
          applicationId: newApp.id,
          program: c.program || 'ENGINEERING_AND_TECHNOLOGY',
          courseName: c.courseName,
          level: c.level || 'UG',
          durationYears: c.durationYears || 4,
          existingIntake: Number(c.existingIntake) || 0,
          proposedIntake: Number(c.proposedIntake) || 60,
          facultyCount: Number(c.facultyCount) || 4,
          nbaAccredited: Boolean(c.nbaAccredited),
        })),
      });
    }

    // Audit log
    await recordAuditLog({
      userId: user.id,
      userRole: user.role,
      userEmail: user.email,
      action: submitImmediately ? 'SUBMIT' : 'CREATE',
      entityType: 'APPLICATION',
      entityId: newApp.id,
      description: `Application ${appNumber} created by institution administrator. Status: ${status}.`,
      newState: { status, currentStageCode },
      ipAddress: req.ip || '127.0.0.1',
    });

    // Notify Regional Scrutiny Desk if submitted immediately
    if (submitImmediately) {
      const bureauOfficers = await prisma.user.findMany({
        where: { role: 'BUREAU_OFFICER' },
      });
      for (const bo of bureauOfficers) {
        await NotificationService.createNotification({
          userId: bo.id,
          title: 'New Application Submitted for Approval',
          titleHi: 'अनुमोदन हेतु नया आवेदन प्रस्तुत किया गया',
          titleMr: 'मंजुरीसाठी नवीन अर्ज सादर केला गेला',
          message: `Application ${appNumber} has been officially submitted by the institution and requires preliminary validation.`,
          type: 'APPLICATION_STATUS',
          priority: 'NORMAL',
          actionUrl: `/applications/${newApp.id}`,
        });
      }
    }

    res.status(201).json({
      success: true,
      message: `Application ${appNumber} created successfully.`,
      data: newApp,
    });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ success: false, message: 'Failed to create application.' });
  }
};

export const submitApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user;

    const application = await prisma.application.findUnique({
      where: { id },
      include: { courses: true, documents: true },
    });

    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found.' });
      return;
    }

    if (user?.role === 'INSTITUTION_ADMIN' && user.institutionId !== application.institutionId) {
      res.status(403).json({ success: false, message: 'Unauthorized to submit this application.' });
      return;
    }

    if (application.status !== 'DRAFT') {
      res.status(400).json({
        success: false,
        message: 'This application has already progressed beyond the draft stage.',
      });
      return;
    }

    const now = new Date();
    const updated = await prisma.application.update({
      where: { id },
      data: {
        status: 'SUBMITTED',
        currentStageCode: 'STAGE_VALIDATION',
        submissionDate: now,
      },
    });

    await recordAuditLog({
      userId: user?.id,
      userRole: user?.role,
      userEmail: user?.email,
      action: 'SUBMIT',
      entityType: 'APPLICATION',
      entityId: id,
      description: `Application ${application.applicationNumber} officially submitted by applicant institution.`,
      oldState: { status: 'DRAFT' },
      newState: { status: 'SUBMITTED', currentStageCode: 'STAGE_VALIDATION' },
      ipAddress: req.ip || '127.0.0.1',
    });

    res.json({
      success: true,
      message: 'Application has been successfully submitted for AICTE scrutiny.',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit application.' });
  }
};
