import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { recordAuditLog } from '../middleware/audit';
import { NotificationService } from '../services/notificationService';

export const getInspections = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const { status, inspectionType } = req.query;

    const where: any = {};

    if (user?.role === 'INSTITUTION_ADMIN' && user.institutionId) {
      where.institutionId = user.institutionId;
    } else if (user?.role === 'EVC_MEMBER') {
      where.committeeMembers = {
        some: { userId: user.id },
      };
    }

    if (status && typeof status === 'string' && status !== 'ALL') {
      where.status = status;
    }

    if (inspectionType && typeof inspectionType === 'string' && inspectionType !== 'ALL') {
      where.inspectionType = inspectionType;
    }

    const inspections = await prisma.inspection.findMany({
      where,
      include: {
        application: {
          select: { id: true, applicationNumber: true, applicationType: true },
        },
        institution: {
          select: { id: true, name: true, permanentId: true, city: true, state: true },
        },
        committeeMembers: {
          include: {
            user: {
              select: { id: true, fullName: true, designation: true, email: true },
            },
          },
        },
        checklists: true,
      },
      orderBy: { scheduledDate: 'desc' },
    });

    res.json({
      success: true,
      data: inspections,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve inspection records.' });
  }
};

export const scheduleInspection = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const { applicationId, inspectionType, scheduledDate, committeeUserIds } = req.body;

    if (!user || !['REGIONAL_OFFICER', 'CENTRAL_ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      res.status(403).json({ success: false, message: 'Unauthorized to schedule EVC inspections.' });
      return;
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { institution: true },
    });

    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found.' });
      return;
    }

    // Conflict of Interest Detection:
    // Check if any committee expert belongs to the same institution or region
    const conflictWarnings: string[] = [];
    if (Array.isArray(committeeUserIds) && committeeUserIds.length > 0) {
      const assignedUsers = await prisma.user.findMany({
        where: { id: { in: committeeUserIds } },
        include: { institution: true },
      });

      for (const u of assignedUsers) {
        if (u.institutionId === application.institutionId) {
          res.status(400).json({
            success: false,
            message: `Conflict of Interest Detected: Expert ${u.fullName} is affiliated with the applicant institution. Assignment rejected under APH regulations.`,
          });
          return;
        }
        if (u.regionId && u.regionId === application.institution.regionId) {
          conflictWarnings.push(`Note: Expert ${u.fullName} is from the same geographical region. Cross-regional observer recommended.`);
        }
      }
    }

    const count = await prisma.inspection.count();
    const inspectionNumber = `EVC-2026-${String(count + 101).padStart(4, '0')}`;

    const newInspection = await prisma.inspection.create({
      data: {
        inspectionNumber,
        applicationId,
        institutionId: application.institutionId,
        inspectionType: inspectionType || 'PHYSICAL',
        scheduledDate: new Date(scheduledDate),
        status: 'SCHEDULED',
        geotagLat: 19.0222,
        geotagLng: 72.8561,
      },
    });

    // Assign Committee Members
    if (Array.isArray(committeeUserIds)) {
      for (let i = 0; i < committeeUserIds.length; i++) {
        const role = i === 0 ? 'CHAIRMAN' : i === 1 ? 'MEMBER_SECRETARY' : 'SUBJECT_EXPERT';
        await prisma.inspectionMember.create({
          data: {
            inspectionId: newInspection.id,
            userId: committeeUserIds[i],
            roleInCommittee: role,
          },
        });

        // Notify expert
        await NotificationService.createNotification({
          userId: committeeUserIds[i],
          title: 'EVC Committee Nomination Notice',
          titleHi: 'ईवीसी समिति नामांकन सूचना',
          titleMr: 'ईव्हीसी समिती नामांकन सूचना',
          message: `You have been appointed as ${role} for inspection ${inspectionNumber} at ${application.institution.name}.`,
          type: 'INSPECTION_SCHEDULED',
          priority: 'HIGH',
          actionUrl: `/inspections`,
        });
      }
    }

    // Create Standard Statutory Checklists
    await prisma.inspectionChecklist.createMany({
      data: [
        {
          inspectionId: newInspection.id,
          sectionName: 'INFRASTRUCTURE',
          itemName: 'Instructional built-up area and carpet area adequacy as per Schedule 2 of APH',
          isCompliant: true,
          score: 10,
        },
        {
          inspectionId: newInspection.id,
          sectionName: 'LAB_EQUIPMENT',
          itemName: 'Availability of specialized lab equipment, licensed software, and fiber internet (min 100 Mbps)',
          isCompliant: true,
          score: 9,
        },
        {
          inspectionId: newInspection.id,
          sectionName: 'FACULTY_VERIFICATION',
          itemName: 'Physical & biometric verification of faculty certificates, cadre ratios, and 7th CPC salary accounts',
          isCompliant: true,
          score: 9,
        },
        {
          inspectionId: newInspection.id,
          sectionName: 'SAFETY_AND_BARRIER_FREE',
          itemName: 'Barrier-free ramp/lift access for Divyangjan and certified fire fighting systems',
          isCompliant: true,
          score: 10,
        },
      ],
    });

    // Update Application stage to EVC
    await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: 'INSPECTION_SCHEDULED',
        currentStageCode: 'STAGE_EVC',
      },
    });

    // Audit Log
    await recordAuditLog({
      userId: user.id,
      userRole: user.role,
      userEmail: user.email,
      action: 'SCHEDULE_INSPECTION',
      entityType: 'INSPECTION',
      entityId: newInspection.id,
      description: `EVC Inspection ${inspectionNumber} scheduled for ${application.institution.name}. Type: ${inspectionType}.`,
      ipAddress: req.ip || '127.0.0.1',
    });

    res.status(201).json({
      success: true,
      message: `Inspection ${inspectionNumber} scheduled successfully.`,
      data: newInspection,
      conflictWarnings,
    });
  } catch (error) {
    console.error('Error scheduling inspection:', error);
    res.status(500).json({ success: false, message: 'Failed to schedule inspection.' });
  }
};

export const submitInspectionReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { recommendation, summaryReport, checklists } = req.body;
    const user = req.user;

    if (!user || !['EVC_MEMBER', 'REGIONAL_OFFICER', 'CENTRAL_ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      res.status(403).json({ success: false, message: 'Unauthorized to submit EVC inspection reports.' });
      return;
    }

    const inspection = await prisma.inspection.findUnique({
      where: { id },
      include: { application: true },
    });

    if (!inspection) {
      res.status(404).json({ success: false, message: 'Inspection record not found.' });
      return;
    }

    // Update inspection
    const updated = await prisma.inspection.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        recommendation,
        summaryReport,
        completedAt: new Date(),
      },
    });

    // Update checklist items if provided
    if (Array.isArray(checklists)) {
      for (const item of checklists) {
        if (item.id) {
          await prisma.inspectionChecklist.update({
            where: { id: item.id },
            data: {
              isCompliant: item.isCompliant,
              score: item.score,
              remarks: item.remarks,
            },
          });
        }
      }
    }

    // Advance Application to Committee Review
    await prisma.application.update({
      where: { id: inspection.applicationId },
      data: {
        status: 'INSPECTION_COMPLETED',
        currentStageCode: 'STAGE_COMMITTEE',
      },
    });

    await recordAuditLog({
      userId: user.id,
      userRole: user.role,
      userEmail: user.email,
      action: 'SUBMIT_INSPECTION_REPORT',
      entityType: 'INSPECTION',
      entityId: id,
      description: `EVC Report filed for ${inspection.inspectionNumber}. Recommendation: ${recommendation}.`,
      newState: { recommendation, summaryReport },
      ipAddress: req.ip || '127.0.0.1',
    });

    res.json({
      success: true,
      message: 'EVC Inspection report and recommendations recorded successfully.',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit inspection report.' });
  }
};
