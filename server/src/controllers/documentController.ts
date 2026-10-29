import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { recordAuditLog } from '../middleware/audit';
import { OcrService } from '../services/ocrService';
import { NotificationService } from '../services/notificationService';

export const getDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const { applicationId, institutionId, category, status } = req.query;

    const where: any = {};

    if (user?.role === 'INSTITUTION_ADMIN' && user.institutionId) {
      where.institutionId = user.institutionId;
    } else if (institutionId && typeof institutionId === 'string') {
      where.institutionId = institutionId;
    }

    if (applicationId && typeof applicationId === 'string') {
      where.applicationId = applicationId;
    }

    if (category && typeof category === 'string' && category !== 'ALL') {
      where.category = category;
    }

    if (status && typeof status === 'string' && status !== 'ALL') {
      where.status = status;
    }

    const documents = await prisma.document.findMany({
      where,
      include: {
        ocrData: true,
        institution: {
          select: { name: true, permanentId: true },
        },
        application: {
          select: { applicationNumber: true },
        },
      },
      orderBy: { uploadedAt: 'desc' },
    });

    res.json({
      success: true,
      data: documents,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve documents.' });
  }
};

export const uploadDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const { applicationId, institutionId, category, title } = req.body;
    const file = req.file;

    const targetInstId =
      user?.role === 'INSTITUTION_ADMIN' && user.institutionId ? user.institutionId : institutionId;

    if (!targetInstId || !category || !title) {
      res.status(400).json({
        success: false,
        message: 'Institution ID, document category, and document title are required.',
      });
      return;
    }

    const fileName = file ? file.originalname : `${category}_Certificate.pdf`;
    const filePath = file ? `/uploads/${file.filename}` : `/uploads/demo/${fileName}`;
    const fileSize = file ? file.size : 1540000;
    const mimeType = file ? file.mimetype : 'application/pdf';
    const diskPath = file ? file.path : undefined;

    // 1. Create Document Record
    const document = await prisma.document.create({
      data: {
        applicationId: applicationId || null,
        institutionId: targetInstId,
        category,
        title,
        fileName,
        filePath,
        fileSize,
        mimeType,
        status: 'PENDING',
      },
    });

    // 2. Perform Intelligent OCR Extraction
    const ocrResult = await OcrService.extractDocumentMetadata(category, fileName, diskPath);

    const ocrRecord = await prisma.documentOcrData.create({
      data: {
        documentId: document.id,
        extractedDocNumber: ocrResult.docNumber,
        extractedIssueDate: ocrResult.issueDate,
        extractedExpiryDate: ocrResult.expiryDate,
        extractedAuthority: ocrResult.issuingAuthority,
        confidenceScore: ocrResult.confidenceScore,
        rawExtractedJson: JSON.stringify(ocrResult.rawJson),
        isConfirmed: false,
      },
    });

    // Update document dates if extracted
    await prisma.document.update({
      where: { id: document.id },
      data: {
        issueDate: ocrResult.issueDate,
        expiryDate: ocrResult.expiryDate,
      },
    });

    // Audit Log
    await recordAuditLog({
      userId: user?.id,
      userRole: user?.role,
      userEmail: user?.email,
      action: 'UPLOAD_DOC',
      entityType: 'DOCUMENT',
      entityId: document.id,
      description: `Uploaded mandatory document "${title}" (${category}). OCR Confidence: ${Math.round(
        ocrResult.confidenceScore * 100
      )}%.`,
      ipAddress: req.ip || '127.0.0.1',
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded and pre-screened with OCR extraction successfully.',
      data: {
        ...document,
        ocrData: ocrRecord,
      },
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ success: false, message: 'Failed to process document upload.' });
  }
};

export const reviewDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body; // VERIFIED, REJECTED, CLARIFICATION_NEEDED
    const user = req.user;

    if (!user || !['BUREAU_OFFICER', 'CENTRAL_ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      res.status(403).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        institution: { include: { users: true } },
      },
    });

    if (!document) {
      res.status(404).json({ success: false, message: 'Document not found.' });
      return;
    }

    const updated = await prisma.document.update({
      where: { id },
      data: {
        status,
        reviewRemarks: remarks,
        reviewedById: user.id,
        reviewedAt: new Date(),
      },
    });

    // Audit Log
    await recordAuditLog({
      userId: user.id,
      userRole: user.role,
      userEmail: user.email,
      action: 'REVIEW_DOC',
      entityType: 'DOCUMENT',
      entityId: id,
      description: `Document "${document.title}" reviewed. Result: ${status}. Remarks: ${remarks || 'None'}.`,
      oldState: { status: document.status },
      newState: { status, remarks },
      ipAddress: req.ip || '127.0.0.1',
    });

    // Notify institution if rejected or clarification needed
    if (status === 'REJECTED' || status === 'CLARIFICATION_NEEDED') {
      for (const instUser of document.institution.users) {
        await NotificationService.createNotification({
          userId: instUser.id,
          title: `Document ${status === 'REJECTED' ? 'Rejected' : 'Clarification Required'}`,
          titleHi: `दस्तावेज़ ${status === 'REJECTED' ? 'अस्वीकृत' : 'स्पष्टीकरण अपेक्षित'}`,
          titleMr: `दस्तऐवज ${status === 'REJECTED' ? 'नाकारला' : 'स्पष्टीकरण आवश्यक'}`,
          message: `Your document "${document.title}" requires attention: ${remarks}`,
          type: 'DOCUMENT_DEFICIENCY',
          priority: 'HIGH',
          actionUrl: `/documents`,
        });
      }
    }

    res.json({
      success: true,
      message: `Document status updated to ${status}.`,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to record document review.' });
  }
};

export const confirmOcrMetadata = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { docNumber, issueDate, expiryDate, issuingAuthority } = req.body;
    const user = req.user;

    const ocrData = await prisma.documentOcrData.findUnique({
      where: { documentId: id },
    });

    if (!ocrData) {
      res.status(404).json({ success: false, message: 'OCR record not found for this document.' });
      return;
    }

    const updatedOcr = await prisma.documentOcrData.update({
      where: { documentId: id },
      data: {
        extractedDocNumber: docNumber,
        extractedIssueDate: issueDate ? new Date(issueDate) : null,
        extractedExpiryDate: expiryDate ? new Date(expiryDate) : null,
        extractedAuthority: issuingAuthority,
        isConfirmed: true,
      },
    });

    // Synchronize to document
    await prisma.document.update({
      where: { id },
      data: {
        issueDate: issueDate ? new Date(issueDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
      },
    });

    await recordAuditLog({
      userId: user?.id,
      userRole: user?.role,
      userEmail: user?.email,
      action: 'CONFIRM_OCR',
      entityType: 'DOCUMENT_OCR',
      entityId: id,
      description: `OCR certificate metadata verified and confirmed by official officer.`,
      ipAddress: req.ip || '127.0.0.1',
    });

    res.json({
      success: true,
      message: 'OCR metadata successfully verified and saved.',
      data: updatedOcr,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to confirm OCR data.' });
  }
};
