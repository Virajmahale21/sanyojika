import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { recordAuditLog } from '../middleware/audit';
import { NotificationService } from '../services/notificationService';
import { DelayRiskEngine } from '../services/riskEngine';

export const getWorkflowTemplates = async (_req: Request, res: Response): Promise<void> => {
  try {
    const templates = await prisma.workflowTemplate.findMany({
      include: {
        stages: {
          orderBy: { sequenceOrder: 'asc' },
        },
      },
    });

    res.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve workflow templates.' });
  }
};

export const advanceApplicationStage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { targetStageCode, remarks } = req.body;
    const user = req.user;

    if (!user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        institution: {
          include: { users: true },
        },
        documents: true,
      },
    });

    if (!application) {
      res.status(404).json({ success: false, message: 'Application record not found.' });
      return;
    }

    // Role check: Only officers can advance stages
    if (!['BUREAU_OFFICER', 'CENTRAL_ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      res.status(403).json({
        success: false,
        message: 'You lack administrative authority to advance application review stages.',
      });
      return;
    }

    // Determine new status based on target stage
    let newStatus = application.status;
    if (targetStageCode === 'STAGE_VALIDATION') newStatus = 'INITIAL_VALIDATION';
    else if (targetStageCode === 'STAGE_SCRUTINY') newStatus = 'UNDER_SCRUTINY';
    else if (targetStageCode === 'STAGE_EVC') newStatus = 'INSPECTION_SCHEDULED';
    else if (targetStageCode === 'STAGE_COMMITTEE') newStatus = 'COMMITTEE_REVIEW';
    else if (targetStageCode === 'STAGE_APPROVAL') newStatus = 'APPROVED';

    const oldStage = application.currentStageCode;
    const oldStatus = application.status;

    // Recalculate Delay-Risk Score
    const updatedRisk = DelayRiskEngine.calculateRisk({
      status: newStatus,
      submissionDate: application.submissionDate,
      targetDueDate: application.targetDueDate,
      pendingTasksCount: 0,
      overdueTasksCount: 0,
      missingMandatoryDocsCount: application.documents.filter((d) => d.status === 'REJECTED').length,
      daysInCurrentStage: 2,
      slaDays: 7,
    });

    const updated = await prisma.application.update({
      where: { id },
      data: {
        currentStageCode: targetStageCode,
        status: newStatus,
        assignedOfficerId: user.id,
        overallRemarks: remarks || application.overallRemarks,
        delayRiskScore: updatedRisk.score,
        delayRiskLevel: updatedRisk.level,
        delayRiskReasons: JSON.stringify(updatedRisk.reasons),
      },
    });

    // Record Audit Log
    await recordAuditLog({
      userId: user.id,
      userRole: user.role,
      userEmail: user.email,
      action: 'ADVANCE_STAGE',
      entityType: 'APPLICATION',
      entityId: id,
      description: `Application advanced from ${oldStage} to ${targetStageCode}. Remarks: ${remarks || 'None'}.`,
      oldState: { stage: oldStage, status: oldStatus },
      newState: { stage: targetStageCode, status: newStatus },
      ipAddress: req.ip || '127.0.0.1',
    });

    // Notify institution nodal officers
    for (const instUser of application.institution.users) {
      await NotificationService.createNotification({
        userId: instUser.id,
        title: 'Application Stage Updated',
        titleHi: 'आवेदन चरण अद्यतित किया गया',
        titleMr: 'अर्जाचा टप्पा अद्ययावत केला गेला',
        message: `Your application ${application.applicationNumber} has successfully progressed to stage: ${targetStageCode}.`,
        type: 'APPLICATION_STATUS',
        priority: 'NORMAL',
        actionUrl: `/applications/${application.id}`,
      });
    }

    res.json({
      success: true,
      message: `Application advanced to ${targetStageCode} successfully.`,
      data: updated,
    });
  } catch (error) {
    console.error('Error advancing stage:', error);
    res.status(500).json({ success: false, message: 'Failed to advance workflow stage.' });
  }
};

export const raiseDeficiencyNotice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { deficiencyRemarks, requiredDocCategory, deadlineDays } = req.body;
    const user = req.user;

    if (!user || !['BUREAU_OFFICER', 'CENTRAL_ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      res.status(403).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        institution: { include: { users: true } },
      },
    });

    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found.' });
      return;
    }

    const days = deadlineDays || 7;
    const taskDueDate = new Date(Date.now() + days * 86400000);

    // Update application to DOCUMENTS_REQUIRED
    const updated = await prisma.application.update({
      where: { id },
      data: {
        status: 'DOCUMENTS_REQUIRED',
        overallRemarks: `Deficiency Notice Issued: ${deficiencyRemarks}`,
        delayRiskScore: 65,
        delayRiskLevel: 'HIGH',
        delayRiskReasons: JSON.stringify([
          'Deficiency notice issued by Bureau Officer',
          `Institutional clarification required within ${days} days`,
        ]),
      },
    });

    // Create Actionable Task for Institution Admin
    const instAdmin = application.institution.users.find((u) => u.role === 'INSTITUTION_ADMIN');
    if (instAdmin) {
      await prisma.task.create({
        data: {
          title: `Resolve Deficiency for Application ${application.applicationNumber}`,
          titleHi: `आवेदन ${application.applicationNumber} हेतु त्रुटि निवारण`,
          titleMr: `अर्ज ${application.applicationNumber} करिता त्रुटी निराकरण`,
          description: deficiencyRemarks,
          relatedEntityType: 'APPLICATION',
          relatedEntityId: application.id,
          assignedToUserId: instAdmin.id,
          priority: 'HIGH',
          dueDate: taskDueDate,
          applicationId: application.id,
        },
      });

      // Dispatched multilingual alert
      await NotificationService.createNotification({
        userId: instAdmin.id,
        title: 'DEFICIENCY NOTICE: Clarification Required',
        titleHi: 'त्रुटि सूचना: स्पष्टीकरण अपेक्षित',
        titleMr: 'त्रुटी नोटीस: स्पष्टीकरण आवश्यक',
        message: `Bureau Scrutiny Desk has raised a deficiency: "${deficiencyRemarks}". Please provide evidence within ${days} days.`,
        type: 'DOCUMENT_DEFICIENCY',
        priority: 'URGENT',
        actionUrl: `/applications/${application.id}`,
      });
    }

    // Audit Log
    await recordAuditLog({
      userId: user.id,
      userRole: user.role,
      userEmail: user.email,
      action: 'REQUEST_DEFICIENCY',
      entityType: 'APPLICATION',
      entityId: id,
      description: `Deficiency notice issued: ${deficiencyRemarks}`,
      oldState: { status: application.status },
      newState: { status: 'DOCUMENTS_REQUIRED' },
      ipAddress: req.ip || '127.0.0.1',
    });

    res.json({
      success: true,
      message: 'Deficiency notice officially issued to applicant institution.',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to issue deficiency notice.' });
  }
};

export const recordRegulatoryDecision = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { decision, remarks } = req.body; // APPROVED or REJECTED
    const user = req.user;

    if (!user || !['CENTRAL_ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      res.status(403).json({
        success: false,
        message: 'Only Central Approval Bureau / Council Leadership can record final decisions.',
      });
      return;
    }

    if (!['APPROVED', 'REJECTED'].includes(decision)) {
      res.status(400).json({ success: false, message: 'Decision must be either APPROVED or REJECTED.' });
      return;
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        institution: { include: { users: true } },
      },
    });

    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found.' });
      return;
    }

    const now = new Date();
    const updated = await prisma.application.update({
      where: { id },
      data: {
        status: decision,
        decisionDate: now,
        overallRemarks: remarks || `Final Council Decision: ${decision}`,
        delayRiskScore: decision === 'APPROVED' ? 5 : 90,
        delayRiskLevel: decision === 'APPROVED' ? 'LOW' : 'CRITICAL',
      },
    });

    // Record Immutable Audit Log
    await recordAuditLog({
      userId: user.id,
      userRole: user.role,
      userEmail: user.email,
      action: decision,
      entityType: 'APPLICATION',
      entityId: id,
      description: `Official Council Order granted. Result: ${decision}. Remarks: ${remarks || 'None'}.`,
      oldState: { status: application.status },
      newState: { status: decision, decisionDate: now },
      ipAddress: req.ip || '127.0.0.1',
    });

    // Notify applicant institution
    for (const instUser of application.institution.users) {
      await NotificationService.createNotification({
        userId: instUser.id,
        title: `Official Decision: Application ${decision}`,
        titleHi: `आधिकारिक निर्णय: आवेदन ${decision === 'APPROVED' ? 'स्वीकृत' : 'अस्वीकृत'}`,
        titleMr: `अधिकृत निर्णय: अर्ज ${decision === 'APPROVED' ? 'मंजूर' : 'नाकारला'}`,
        message: `Council has rendered its final decision on ${application.applicationNumber}: ${decision}.`,
        type: 'APPLICATION_STATUS',
        priority: 'HIGH',
        actionUrl: `/applications/${application.id}`,
      });
    }

    res.json({
      success: true,
      message: `Regulatory decision ${decision} recorded successfully.`,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to record regulatory decision.' });
  }
};
