import { prisma } from '../config/prisma';

export interface CreateNotificationParams {
  userId: string;
  title: string;
  titleHi?: string;
  titleMr?: string;
  message: string;
  messageHi?: string;
  messageMr?: string;
  type: string;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  actionUrl?: string;
  sendEmailSimulated?: boolean;
}

export class NotificationService {
  public static async createNotification(params: CreateNotificationParams) {
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        title: params.title,
        titleHi: params.titleHi || params.title,
        titleMr: params.titleMr || params.title,
        message: params.message,
        messageHi: params.messageHi || params.message,
        messageMr: params.messageMr || params.message,
        type: params.type,
        priority: params.priority || 'NORMAL',
        actionUrl: params.actionUrl || null,
        isRead: false,
      },
    });

    if (params.sendEmailSimulated) {
      console.log(
        `[Simulated Dispatch] Email sent to User ${params.userId} | Subject: "${params.title}" | Type: ${params.type}`
      );
    }

    return notification;
  }
}
