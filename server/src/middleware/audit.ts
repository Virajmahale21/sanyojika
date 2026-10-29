import { prisma } from '../config/prisma';

export interface AuditLogParams {
  userId?: string | null;
  userRole?: string | null;
  userEmail?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  description: string;
  oldState?: any;
  newState?: any;
  ipAddress?: string;
}

export const recordAuditLog = async (params: AuditLogParams) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId || null,
        userRole: params.userRole || null,
        userEmail: params.userEmail || null,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        description: params.description,
        oldState: params.oldState ? JSON.stringify(params.oldState) : null,
        newState: params.newState ? JSON.stringify(params.newState) : null,
        ipAddress: params.ipAddress || '127.0.0.1',
      },
    });
  } catch (error) {
    console.error('Failed to write audit log entry:', error);
  }
};
