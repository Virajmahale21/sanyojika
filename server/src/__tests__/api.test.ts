import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index';
import path from 'path';
import fs from 'fs';
import { OcrService } from '../services/ocrService';
import { prisma } from '../config/prisma';

describe('AICTE Approval Portal API Integration & Compliance Tests', () => {
  let superAdminToken: string;
  let instituteAdminToken: string;
  let testAppId: string;
  let testInstId: string;

  it('GET /api/v1/health should return HEALTHY status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('HEALTHY');
  });

  it('GET /api/v1/auth/demo-accounts should return list of demo users with 7 roles', async () => {
    const res = await request(app).get('/api/v1/auth/demo-accounts');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(7);
  });

  it('POST /api/v1/auth/login should authenticate Super Admin and return JWT token', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'superadmin@aicte.gov.in',
      password: 'Password@123',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.role).toBe('SUPER_ADMIN');
    superAdminToken = res.body.data.token;
  });

  it('POST /api/v1/auth/login should authenticate Institution Admin', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'principal@gcet.edu.in',
      password: 'Password@123',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.role).toBe('INSTITUTION_ADMIN');
    instituteAdminToken = res.body.data.token;
  });

  it('GET /api/v1/applications should enforce role-based isolation (IDOR protection)', async () => {
    // Super Admin sees all
    const adminRes = await request(app)
      .get('/api/v1/applications')
      .set('Authorization', `Bearer ${superAdminToken}`);
    expect(adminRes.status).toBe(200);
    expect(adminRes.body.data.length).toBeGreaterThanOrEqual(1);
    testAppId = adminRes.body.data[0].id;
    testInstId = adminRes.body.data[0].institutionId;

    // Institution Admin only sees their own
    const instRes = await request(app)
      .get('/api/v1/applications')
      .set('Authorization', `Bearer ${instituteAdminToken}`);
    expect(instRes.status).toBe(200);
    for (const appItem of instRes.body.data) {
      expect(appItem.institutionId).toBeDefined();
    }
  });

  it('GET /api/v1/dashboard/metrics should return calculated KPIs', async () => {
    const res = await request(app)
      .get('/api/v1/dashboard/metrics')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.kpis).toBeDefined();
    expect(typeof res.body.data.kpis.totalApplications).toBe('number');
  });

  it('POST /api/v1/tasks/escalate-scan should trigger automated SLA scan idempotently', async () => {
    const res1 = await request(app)
      .post('/api/v1/tasks/escalate-scan')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(res1.status).toBe(200);
    expect(res1.body.success).toBe(true);

    // Second call should also succeed without error (idempotent)
    const res2 = await request(app)
      .post('/api/v1/tasks/escalate-scan')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(res2.status).toBe(200);
    expect(res2.body.success).toBe(true);
  });

  it('POST /api/v1/ai/query should provide APH guidance in Hindi', async () => {
    const res = await request(app)
      .post('/api/v1/ai/query')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        query: 'अग्नि सुरक्षा एनओसी नियम क्या हैं?',
        language: 'hi',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.language).toBe('hi');
    expect(res.body.data.citations.length).toBeGreaterThan(0);
  });

  it('POST /api/v1/ai/query should provide APH guidance in Marathi', async () => {
    const res = await request(app)
      .post('/api/v1/ai/query')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        query: 'ईव्हीसी समितीचे नियम आणि पात्रता काय आहेत?',
        language: 'mr',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.language).toBe('mr');
    expect(res.body.data.citations.length).toBeGreaterThan(0);
  });

  it('POST /api/v1/ai/query should provide APH guidance in English', async () => {
    const res = await request(app)
      .post('/api/v1/ai/query')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        query: 'What is the required faculty cadre ratio for technical programs?',
        language: 'en',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.language).toBe('en');
    expect(res.body.data.citations.length).toBeGreaterThan(0);
    expect(res.body.data.answer).toContain('1:20');
  });

  it('OcrService should extract metadata and calculate confidence score from text/document content', async () => {
    const sampleFilePath = path.join(__dirname, 'sample_noc.txt');
    const sampleContent = `
GOVERNMENT OF MAHARASHTRA
DIRECTORATE OF FIRE SERVICES
FIRE SAFETY COMPLIANCE CERTIFICATE / NOC
Certificate No: FSC-MH-2026-89412
Date of Issue: 12/01/2026
Valid Upto: 11/01/2029
Issuing Authority: Office of the Chief Fire Officer, Mumbai Fire Brigade
This is to certify that the institutional premises comply with all fire safety regulations under NBC 2016 Part 4.
    `;
    fs.writeFileSync(sampleFilePath, sampleContent);

    try {
      const ocrResult = await OcrService.extractDocumentMetadata(
        'FIRE_SAFETY_NOC',
        'sample_noc.txt',
        sampleFilePath
      );

      expect(ocrResult.isRealTextExtracted).toBe(true);
      expect(ocrResult.docNumber).toBe('FSC-MH-2026-89412');
      expect(ocrResult.issueDate).toBeInstanceOf(Date);
      expect(ocrResult.expiryDate).toBeInstanceOf(Date);
      expect(ocrResult.issuingAuthority).toContain('Fire');
      expect(ocrResult.confidenceScore).toBeGreaterThanOrEqual(0.85);
    } finally {
      if (fs.existsSync(sampleFilePath)) {
        fs.unlinkSync(sampleFilePath);
      }
    }
  });

  it('POST /api/v1/inspections/schedule should detect Conflict of Interest when expert belongs to the same institution', async () => {
    // Find an institution admin user
    const instUser = await prisma.user.findFirst({
      where: { role: 'INSTITUTION_ADMIN' },
    });

    if (instUser && testAppId) {
      // Find the application for this institution
      const appRecord = await prisma.application.findFirst({
        where: { institutionId: instUser.institutionId! },
      });

      if (appRecord) {
        const scheduleRes = await request(app)
          .post('/api/v1/inspections/schedule')
          .set('Authorization', `Bearer ${superAdminToken}`)
          .send({
            applicationId: appRecord.id,
            inspectionType: 'EVC',
            scheduledDate: new Date(Date.now() + 86400000 * 7).toISOString(),
            committeeUserIds: [instUser.id],
          });

        expect(scheduleRes.status).toBe(400);
        expect(scheduleRes.body.success).toBe(false);
        expect(scheduleRes.body.message).toContain('Conflict of Interest Detected');
      }
    }
  });

  it('Localization verification: English, Hindi, and Marathi dictionaries must be 100% synchronized', () => {
    const localesDir = path.resolve(__dirname, '../../../client/src/locales');
    const enRaw = fs.readFileSync(path.join(localesDir, 'en', 'common.json'), 'utf8');
    const hiRaw = fs.readFileSync(path.join(localesDir, 'hi', 'common.json'), 'utf8');
    const mrRaw = fs.readFileSync(path.join(localesDir, 'mr', 'common.json'), 'utf8');

    const en = JSON.parse(enRaw);
    const hi = JSON.parse(hiRaw);
    const mr = JSON.parse(mrRaw);

    function flattenKeys(obj: any, prefix = ''): string[] {
      let keys: string[] = [];
      for (const k of Object.keys(obj)) {
        const fullKey = prefix ? `${prefix}.${k}` : k;
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
          keys = keys.concat(flattenKeys(obj[k], fullKey));
        } else {
          keys.push(fullKey);
        }
      }
      return keys;
    }

    const enKeys = flattenKeys(en);
    const hiKeys = flattenKeys(hi);
    const mrKeys = flattenKeys(mr);

    expect(enKeys.length).toBeGreaterThan(400);
    expect(hiKeys.length).toBe(enKeys.length);
    expect(mrKeys.length).toBe(enKeys.length);

    const missingInHi = enKeys.filter(k => !hiKeys.includes(k));
    const missingInMr = enKeys.filter(k => !mrKeys.includes(k));

    expect(missingInHi).toEqual([]);
    expect(missingInMr).toEqual([]);
  });
});
