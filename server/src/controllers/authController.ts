import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { recordAuditLog } from '../middleware/audit';

const JWT_SECRET = process.env.JWT_SECRET || 'anumatisetu_portal_secure_jwt_secret_governance';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email identifier and password credentials are required.',
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      include: {
        department: true,
        region: true,
        institution: true,
      },
    });

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials or the user account is inactive.',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your official password.',
      });
      return;
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: (JWT_EXPIRES_IN as any) }
    );

    // Audit log
    await recordAuditLog({
      userId: user.id,
      userRole: user.role,
      userEmail: user.email,
      action: 'LOGIN',
      entityType: 'USER',
      entityId: user.id,
      description: `Official user authenticated successfully with role ${user.role}.`,
      ipAddress: req.ip || '127.0.0.1',
    });

    res.json({
      success: true,
      message: 'Authentication successful.',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          designation: user.designation,
          role: user.role,
          phone: user.phone,
          preferredLang: user.preferredLang,
          department: user.department,
          region: user.region,
          institution: user.institution,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authentication service encountered an unexpected error.',
    });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        department: true,
        region: true,
        institution: true,
      },
    });

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not retrieve profile.' });
  }
};

export const updateLanguagePreference = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { language } = req.body;
    if (!['en', 'hi', 'mr'].includes(language)) {
      res.status(400).json({ success: false, message: 'Unsupported language code.' });
      return;
    }

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { preferredLang: language },
    });

    res.json({
      success: true,
      message: 'Language preference saved successfully.',
      data: { preferredLang: updated.preferredLang },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update language.' });
  }
};

export const getDemoAccounts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        designation: true,
        role: true,
        preferredLang: true,
        institution: {
          select: { name: true, permanentId: true },
        },
        department: {
          select: { name: true },
        },
        region: {
          select: { name: true },
        },
      },
      orderBy: { role: 'asc' },
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not fetch demo users.' });
  }
};
