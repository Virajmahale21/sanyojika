import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { recordAuditLog } from '../middleware/audit';

export const getInstitutions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, state, search } = req.query;

    const where: any = {};

    if (category && typeof category === 'string' && category !== 'ALL') {
      where.category = category;
    }

    if (state && typeof state === 'string' && state !== 'ALL') {
      where.state = state;
    }

    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search } },
        { permanentId: { contains: search } },
        { city: { contains: search } },
      ];
    }

    const institutions = await prisma.institution.findMany({
      where,
      include: {
        region: true,
        _count: {
          select: { applications: true, documents: true, inspections: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json({
      success: true,
      data: institutions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve institutions.' });
  }
};

export const getInstitutionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const institution = await prisma.institution.findUnique({
      where: { id },
      include: {
        region: true,
        applications: {
          orderBy: { createdAt: 'desc' },
        },
        documents: {
          orderBy: { uploadedAt: 'desc' },
        },
        inspections: {
          orderBy: { scheduledDate: 'desc' },
        },
        complianceRecords: {
          include: { requirement: true },
        },
      },
    });

    if (!institution) {
      res.status(404).json({ success: false, message: 'Institution record not found.' });
      return;
    }

    res.json({
      success: true,
      data: institution,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve institution details.' });
  }
};

export const updateInstitution = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { website, contactNumber, principalName, address, city, pinCode } = req.body;
    const user = req.user;

    const updated = await prisma.institution.update({
      where: { id },
      data: {
        website,
        contactNumber,
        principalName,
        address,
        city,
        pinCode,
      },
    });

    await recordAuditLog({
      userId: user?.id,
      userRole: user?.role,
      userEmail: user?.email,
      action: 'UPDATE_INSTITUTION',
      entityType: 'INSTITUTION',
      entityId: id,
      description: `Institutional registry profile updated for ${updated.name}.`,
      ipAddress: req.ip || '127.0.0.1',
    });

    res.json({
      success: true,
      message: 'Institution profile updated successfully.',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update institution profile.' });
  }
};
