import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { recordAuditLog } from '../middleware/audit';
import { NotificationService } from '../services/notificationService';

export const getComplianceRequirements = async (_req: Request, res: Response): Promise<void> => {
  try {
    const requirements = await prisma.complianceRequirement.findMany({
      where: { isActive: true },
      orderBy: { code: 'asc' },
    });

    res.json({
      success: true,
      data: requirements,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve compliance requirements.' });
  }
};

export const getComplianceSubmissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const { institutionId, academicYear, status } = req.query;

    const where: any = {};

    if (user?.role === 'INSTITUTION_ADMIN' && user.institutionId) {
      where.institutionId = user.institutionId;
    } else if (institutionId && typeof institutionId === 'string') {
      where.institutionId = institutionId;
    }

    if (academicYear && typeof academicYear === 'string') {
      where.academicYear = academicYear;
    }

    if (status && typeof status === 'string' && status !== 'ALL') {
      where.status = status;
    }

    const submissions = await prisma.complianceSubmission.findMany({
      where,
      include: {
        requirement: true,
        institution: {
          select: { id: true, name: true, permanentId: true, state: true, city: true },
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    res.json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve compliance submissions.' });
  }
};

export const submitComplianceEvidence = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { evidenceDocUrl, remarks } = req.body;
    const user = req.user;

    const submission = await prisma.complianceSubmission.findUnique({
      where: { id },
      include: { requirement: true },
    });

    if (!submission) {
      res.status(404).json({ success: false, message: 'Compliance submission record not found.' });
      return;
    }

    const updated = await prisma.complianceSubmission.update({
      where: { id },
      data: {
        evidenceDocUrl: evidenceDocUrl || '/uploads/compliance/evidence_submitted.pdf',
        remarks,
        status: 'UNDER_REVIEW',
        submittedDate: new Date(),
      },
    });

    await recordAuditLog({
      userId: user?.id,
      userRole: user?.role,
      userEmail: user?.email,
      action: 'SUBMIT_COMPLIANCE_EVIDENCE',
      entityType: 'COMPLIANCE',
      entityId: id,
      description: `Institutional evidence submitted for "${submission.requirement.title}".`,
      ipAddress: req.ip || '127.0.0.1',
    });

    res.json({
      success: true,
      message: 'Compliance evidence submitted for official verification.',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit compliance evidence.' });
  }
};

export const verifyComplianceSubmission = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body; // COMPLIANT or NON_COMPLIANT
    const user = req.user;

    if (!user || !['BUREAU_OFFICER', 'CENTRAL_ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      res.status(403).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    const updated = await prisma.complianceSubmission.update({
      where: { id },
      data: {
        status,
        remarks,
        verifiedById: user.id,
        verifiedAt: new Date(),
      },
      include: {
        requirement: true,
        institution: { include: { users: true } },
      },
    });

    // Notify institution
    for (const instUser of updated.institution.users) {
      await NotificationService.createNotification({
        userId: instUser.id,
        title: `Compliance Status: ${status === 'COMPLIANT' ? 'Approved' : 'Non-Compliant Notice'}`,
        titleHi: `अनुपालन स्थिति: ${status === 'COMPLIANT' ? 'स्वीकृत' : 'गैर-अनुपालन नोटिस'}`,
        titleMr: `अनुपालन स्थिती: ${status === 'COMPLIANT' ? 'मंजूर' : 'अनुकूलता नसलेली नोटीस'}`,
        message: `Your compliance submission for "${updated.requirement.title}" has been reviewed: ${remarks || status}`,
        type: 'COMPLIANCE_DEADLINE',
        priority: status === 'COMPLIANT' ? 'NORMAL' : 'HIGH',
        actionUrl: `/compliance`,
      });
    }

    await recordAuditLog({
      userId: user.id,
      userRole: user.role,
      userEmail: user.email,
      action: 'VERIFY_COMPLIANCE',
      entityType: 'COMPLIANCE',
      entityId: id,
      description: `Compliance verified for ${updated.institution.name}. Status: ${status}.`,
      newState: { status, remarks },
      ipAddress: req.ip || '127.0.0.1',
    });

    res.json({
      success: true,
      message: `Compliance record verified and marked as ${status}.`,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to verify compliance record.' });
  }
};
