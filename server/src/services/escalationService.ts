import { prisma } from '../config/prisma';
import { NotificationService } from './notificationService';
import { recordAuditLog } from '../middleware/audit';

export class EscalationService {
  /**
   * Scans overdue tasks and advances escalation levels according to AICTE rules.
   */
  public static async scanAndEscalateTasks() {
    const now = new Date();
    const tasks = await prisma.task.findMany({
      where: {
        status: { in: ['PENDING', 'IN_PROGRESS', 'ESCALATED'] },
        dueDate: { lt: now },
      },
      include: {
        assignedTo: true,
        application: {
          include: {
            institution: true,
          },
        },
      },
    });

    const escalatedEvents = [];

    for (const task of tasks) {
      const overdueDays = Math.ceil((now.getTime() - task.dueDate.getTime()) / (1000 * 60 * 60 * 24));
      let targetLevel = 0;

      if (overdueDays >= 14) {
        targetLevel = 3;
      } else if (overdueDays >= 7) {
        targetLevel = 2;
      } else if (overdueDays >= 3) {
        targetLevel = 1;
      }

      if (targetLevel > task.escalationLevel) {
        // Check if this exact level escalation was already recorded to ensure idempotency
        const existingEvent = await prisma.escalationEvent.findFirst({
          where: {
            taskId: task.id,
            triggeredLevel: targetLevel,
          },
        });

        if (existingEvent) {
          continue;
        }

        // Upgrade task status
        await prisma.task.update({
          where: { id: task.id },
          data: {
            escalationLevel: targetLevel,
            status: 'ESCALATED',
            priority: targetLevel === 3 ? 'CRITICAL' : 'HIGH',
          },
        });

        const roleToNotify =
          targetLevel === 3 ? 'CENTRAL_ADMIN' : targetLevel === 2 ? 'REGIONAL_OFFICER' : 'BUREAU_OFFICER';

        const reason = `Task "${task.title}" is overdue by ${overdueDays} days. Automatic SLA escalation Level ${targetLevel} engaged.`;

        const event = await prisma.escalationEvent.create({
          data: {
            taskId: task.id,
            applicationId: task.applicationId,
            triggeredLevel: targetLevel,
            escalatedToRole: roleToNotify,
            escalatedToUserId: task.assignedToUserId,
            reason,
          },
        });

        // Notify officers
        if (task.assignedToUserId) {
          await NotificationService.createNotification({
            userId: task.assignedToUserId,
            title: `SLA Alert: Task Escalated to Level ${targetLevel}`,
            titleHi: `समय-सीमा चेतावनी: कार्य स्तर ${targetLevel} पर अग्रेषित`,
            titleMr: `मुदत उल्लंघन सूचना: कार्य स्तर ${targetLevel} वर वर्ग`,
            message: reason,
            type: 'ESCALATION_ALERT',
            priority: 'URGENT',
            actionUrl: `/tasks`,
          });
        }

        // Record Consequential Audit
        await recordAuditLog({
          action: 'ESCALATE',
          entityType: 'TASK',
          entityId: task.id,
          description: `Automatic SLA Breach Escalation to Level ${targetLevel} (${overdueDays} days overdue).`,
          oldState: { escalationLevel: task.escalationLevel },
          newState: { escalationLevel: targetLevel, overdueDays },
        });

        escalatedEvents.push(event);
      }
    }

    return {
      scannedCount: tasks.length,
      escalatedCount: escalatedEvents.length,
      events: escalatedEvents,
    };
  }
}
