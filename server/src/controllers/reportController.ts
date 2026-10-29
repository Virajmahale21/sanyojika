import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getSummaryReport = async (_req: Request, res: Response): Promise<void> => {
  try {
    const totalApps = await prisma.application.count();
    const approved = await prisma.application.count({ where: { status: 'APPROVED' } });
    const underReview = await prisma.application.count({
      where: { status: { notIn: ['APPROVED', 'REJECTED', 'DRAFT'] } },
    });
    const rejected = await prisma.application.count({ where: { status: 'REJECTED' } });

    // Applications by type
    const types = ['EOA', 'NEW_CAMPUS', 'INTAKE_INCREASE', 'NEW_COURSE'];
    const appsByType = await Promise.all(
      types.map(async (t) => {
        const count = await prisma.application.count({ where: { applicationType: t } });
        return { type: t, count };
      })
    );

    // Compliance by category
    const compliances = await prisma.complianceSubmission.findMany({
      include: { requirement: true },
    });

    const compliantCount = compliances.filter((c) => c.status === 'COMPLIANT').length;
    const pendingEvidenceCount = compliances.filter((c) => c.status === 'PENDING_EVIDENCE').length;
    const underReviewCount = compliances.filter((c) => c.status === 'UNDER_REVIEW').length;

    // Average days in processing for approved apps
    const approvedApps = await prisma.application.findMany({
      where: { status: 'APPROVED', submissionDate: { not: null }, decisionDate: { not: null } },
      select: { submissionDate: true, decisionDate: true },
    });

    let avgTurnaroundDays = 28;
    if (approvedApps.length > 0) {
      const totalDays = approvedApps.reduce((acc, app) => {
        const diff = (app.decisionDate!.getTime() - app.submissionDate!.getTime()) / (1000 * 60 * 60 * 24);
        return acc + diff;
      }, 0);
      avgTurnaroundDays = Math.round(totalDays / approvedApps.length);
    }

    res.json({
      success: true,
      data: {
        totalApplications: totalApps,
        approvedApplications: approved,
        underReviewApplications: underReview,
        rejectedApplications: rejected,
        averageTurnaroundDays: avgTurnaroundDays,
        applicationsByType: appsByType,
        complianceStats: {
          total: compliances.length,
          compliant: compliantCount,
          pendingEvidence: pendingEvidenceCount,
          underReview: underReviewCount,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate summary report.' });
  }
};

export const exportApplicationsCsv = async (_req: Request, res: Response): Promise<void> => {
  try {
    const apps = await prisma.application.findMany({
      include: {
        institution: { select: { permanentId: true, name: true, city: true, state: true } },
        assignedOfficer: { select: { fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'Application Number',
      'AICTE Permanent ID',
      'Institution Name',
      'City',
      'State',
      'Application Type',
      'Status',
      'Current Stage',
      'Assigned Officer',
      'Delay Risk Score',
      'Delay Risk Level',
      'Submission Date',
    ];

    const rows = apps.map((a) => [
      a.applicationNumber,
      a.institution.permanentId,
      `"${a.institution.name.replace(/"/g, '""')}"`,
      a.institution.city,
      a.institution.state,
      a.applicationType,
      a.status,
      a.currentStageCode,
      a.assignedOfficer ? `"${a.assignedOfficer.fullName}"` : 'Unassigned',
      a.delayRiskScore,
      a.delayRiskLevel,
      a.submissionDate ? a.submissionDate.toISOString().split('T')[0] : 'N/A',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="AICTE_Applications_Report_2026.csv"');
    res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to export CSV report.' });
  }
};
