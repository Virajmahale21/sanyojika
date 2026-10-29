import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { recordAuditLog } from '../middleware/audit';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        designation: true,
        phone: true,
        preferredLang: true,
        isActive: true,
        createdAt: true,
        department: { select: { name: true, code: true } },
        region: { select: { name: true, code: true } },
        institution: { select: { name: true, permanentId: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve user accounts.' });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, fullName, designation, phone, role, departmentId, regionId, institutionId } =
      req.body;
    const actor = req.user;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(400).json({ success: false, message: 'User account with this email already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password || 'Password@123', 10);

    const newUser = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        passwordHash,
        fullName,
        designation,
        phone,
        role,
        departmentId: departmentId || null,
        regionId: regionId || null,
        institutionId: institutionId || null,
      },
    });

    await recordAuditLog({
      userId: actor?.id,
      userRole: actor?.role,
      userEmail: actor?.email,
      action: 'CREATE_USER',
      entityType: 'USER',
      entityId: newUser.id,
      description: `Created user ${fullName} (${email}) with role ${role}.`,
      ipAddress: req.ip || '127.0.0.1',
    });

    res.status(201).json({
      success: true,
      message: 'Official user account created successfully.',
      data: { id: newUser.id, email: newUser.email, fullName: newUser.fullName, role: newUser.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create user account.' });
  }
};

export const getAuditLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { action, entityType, limit } = req.query;

    const where: any = {};
    if (action && typeof action === 'string' && action !== 'ALL') {
      where.action = action;
    }
    if (entityType && typeof entityType === 'string' && entityType !== 'ALL') {
      where.entityType = entityType;
    }

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit ? Number(limit) : 100,
    });

    res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve audit logs.' });
  }
};

export const getSystemSettings = async (_req: Request, res: Response): Promise<void> => {
  try {
    const settings = await prisma.systemSetting.findMany();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve system settings.' });
  }
};

export const resetDemoDatabase = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user || !['SUPER_ADMIN', 'CENTRAL_ADMIN'].includes(user.role)) {
      res.status(403).json({ success: false, message: 'Unauthorized to reset demo database.' });
      return;
    }

    // Call seed logic programmatically or execute tsx prisma/seed.ts
    // For fast execution, import seed logic or re-seed
    const { exec } = await import('child_process');
    exec('npx tsx prisma/seed.ts', { cwd: process.cwd() }, (err, stdout, stderr) => {
      if (err) {
        console.error('Error executing seed reset:', err, stderr);
      } else {
        console.log('Seed reset completed:', stdout);
      }
    });

    await recordAuditLog({
      userId: user.id,
      userRole: user.role,
      userEmail: user.email,
      action: 'RESET_DEMO_DB',
      entityType: 'SYSTEM',
      entityId: 'ALL',
      description: 'Demo database reset command executed. Re-seeded with baseline synthetic test data.',
      ipAddress: req.ip || '127.0.0.1',
    });

    res.json({
      success: true,
      message: 'Demo state successfully reset to initial pristine presentation mode.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reset demo state.' });
  }
};
