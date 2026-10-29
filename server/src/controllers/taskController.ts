import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { EscalationService } from '../services/escalationService';
import { recordAuditLog } from '../middleware/audit';

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const { filter, priority, status } = req.query;

    const where: any = {};
    const now = new Date();

    if (filter === 'MY_TASKS' && user?.id) {
      where.assignedToUserId = user.id;
    } else if (filter === 'DEPT_TASKS' && user?.departmentId) {
      where.departmentId = user.departmentId;
    } else if (filter === 'DUE_SOON') {
      const threeDaysLater = new Date(now.getTime() + 3 * 86400000);
      where.dueDate = { gte: now, lte: threeDaysLater };
      where.status = { not: 'COMPLETED' };
    } else if (filter === 'OVERDUE') {
      where.dueDate = { lt: now };
      where.status = { not: 'COMPLETED' };
    }

    if (priority && typeof priority === 'string' && priority !== 'ALL') {
      where.priority = priority;
    }

    if (status && typeof status === 'string' && status !== 'ALL') {
      where.status = status;
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignedTo: {
          select: { id: true, fullName: true, role: true, email: true },
        },
        department: {
          select: { id: true, name: true, code: true },
        },
        application: {
          select: {
            id: true,
            applicationNumber: true,
            status: true,
            institution: { select: { name: true, permanentId: true } },
          },
        },
        escalationEvents: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: [{ escalationLevel: 'desc' }, { dueDate: 'asc' }],
    });

    res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve tasks.' });
  }
};

export const triggerEscalationScan = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const result = await EscalationService.scanAndEscalateTasks();

    await recordAuditLog({
      userId: user?.id,
      userRole: user?.role,
      userEmail: user?.email,
      action: 'SCAN_ESCALATION',
      entityType: 'TASK',
      entityId: 'SYSTEM',
      description: `Automated SLA breach escalation scan executed. ${result.scannedCount} tasks scanned, ${result.escalatedCount} escalated.`,
      ipAddress: req.ip || '127.0.0.1',
    });

    res.json({
      success: true,
      message: `Escalation scan completed. Scanned: ${result.scannedCount}, Escalated: ${result.escalatedCount}.`,
      data: result,
    });
  } catch (error) {
    console.error('Error during escalation scan:', error);
    res.status(500).json({ success: false, message: 'Failed to execute escalation scan.' });
  }
};

export const updateTaskStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body; // IN_PROGRESS, COMPLETED
    const user = req.user;

    const updated = await prisma.task.update({
      where: { id },
      data: {
        status,
        completedAt: status === 'COMPLETED' ? new Date() : null,
      },
    });

    await recordAuditLog({
      userId: user?.id,
      userRole: user?.role,
      userEmail: user?.email,
      action: 'UPDATE_TASK',
      entityType: 'TASK',
      entityId: id,
      description: `Task status changed to ${status}.`,
      ipAddress: req.ip || '127.0.0.1',
    });

    res.json({
      success: true,
      message: `Task marked as ${status}.`,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update task.' });
  }
};
