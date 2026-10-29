import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getDashboardMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const isInstitution = user?.role === 'INSTITUTION_ADMIN';
    const institutionId = user?.institutionId;

    const baseWhere = isInstitution && institutionId ? { institutionId } : {};

    // 1. Applications Count & Status Summary
    const totalApps = await prisma.application.count({ where: baseWhere });
    const approvedApps = await prisma.application.count({
      where: { ...baseWhere, status: 'APPROVED' },
    });
    const rejectedApps = await prisma.application.count({
      where: { ...baseWhere, status: 'REJECTED' },
    });
    const pendingApps = await prisma.application.count({
      where: {
        ...baseWhere,
        status: { notIn: ['APPROVED', 'REJECTED', 'DRAFT', 'WITHDRAWN'] },
      },
    });

    const now = new Date();
    const overdueApps = await prisma.application.count({
      where: {
        ...baseWhere,
        targetDueDate: { lt: now },
        status: { notIn: ['APPROVED', 'REJECTED'] },
      },
    });

    // 2. Applications by Stage
    const stages = await prisma.workflowStage.findMany({
      orderBy: { sequenceOrder: 'asc' },
    });

    const stageMetrics = await Promise.all(
      stages.map(async (stage) => {
        const count = await prisma.application.count({
          where: {
            ...baseWhere,
            currentStageCode: stage.code,
            status: { notIn: ['APPROVED', 'REJECTED'] },
          },
        });
        return {
          code: stage.code,
          name: stage.name,
          nameHi: stage.nameHi,
          nameMr: stage.nameMr,
          order: stage.sequenceOrder,
          count,
        };
      })
    );

    // 3. Status Breakdown for Pie/Donut Chart
    const allStatuses = [
      'SUBMITTED',
      'INITIAL_VALIDATION',
      'UNDER_SCRUTINY',
      'DOCUMENTS_REQUIRED',
      'INSPECTION_SCHEDULED',
      'APPROVED',
      'REJECTED',
    ];

    const statusCounts = await Promise.all(
      allStatuses.map(async (st) => {
        const count = await prisma.application.count({
          where: { ...baseWhere, status: st },
        });
        return { status: st, count };
      })
    );

    // 4. Compliance Fulfillment Stats
    const totalComplianceReqs = await prisma.complianceRequirement.count({ where: { isActive: true } });
    const totalSubmissions = await prisma.complianceSubmission.count({
      where: isInstitution && institutionId ? { institutionId } : {},
    });
    const compliantCount = await prisma.complianceSubmission.count({
      where: {
        ...(isInstitution && institutionId ? { institutionId } : {}),
        status: 'COMPLIANT',
      },
    });
    const complianceRate = totalSubmissions > 0 ? Math.round((compliantCount / totalSubmissions) * 100) : 85;

    // 5. Expiring Documents within 60 days
    const in60Days = new Date(now.getTime() + 60 * 86400000);
    const expiringDocsCount = await prisma.document.count({
      where: {
        ...(isInstitution && institutionId ? { institutionId } : {}),
        expiryDate: {
          not: null,
          lte: in60Days,
        },
      },
    });

    // 6. Upcoming Inspections
    const upcomingInspectionsCount = await prisma.inspection.count({
      where: {
        ...(isInstitution && institutionId ? { institutionId } : {}),
        status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
      },
    });

    // 7. Regional Workload
    const regions = await prisma.region.findMany();
    const regionalWorkload = await Promise.all(
      regions.map(async (r) => {
        const count = await prisma.application.count({
          where: {
            institution: { regionId: r.id },
          },
        });
        return {
          regionCode: r.code,
          regionName: r.name,
          count,
        };
      })
    );

    // 8. Recent Activities (from Audit Log)
    const recentActivities = await prisma.auditLog.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userRole: true,
        userEmail: true,
        action: true,
        entityType: true,
        description: true,
        createdAt: true,
      },
    });

    // 9. My pending tasks
    const pendingTasks = await prisma.task.count({
      where: {
        ...(user?.id ? { assignedToUserId: user.id } : {}),
        status: { in: ['PENDING', 'IN_PROGRESS', 'ESCALATED'] },
      },
    });

    res.json({
      success: true,
      data: {
        kpis: {
          totalApplications: totalApps,
          pendingApplications: pendingApps,
          approvedApplications: approvedApps,
          rejectedApplications: rejectedApps,
          overdueApplications: overdueApps,
          upcomingInspections: upcomingInspectionsCount,
          expiringDocuments: expiringDocsCount,
          complianceRate,
          pendingTasks,
        },
        stageMetrics,
        statusCounts,
        regionalWorkload,
        recentActivities,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to aggregate dashboard intelligence metrics.',
    });
  }
};
