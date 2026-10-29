import { Router } from 'express';
import {
  getUsers,
  createUser,
  getAuditLogs,
  getSystemSettings,
  resetDemoDatabase,
} from '../controllers/adminController';
import { authenticateJwt, requireRoles } from '../middleware/auth';

const router = Router();

router.use(authenticateJwt);

// User management (Central and Super Admin)
router.get('/users', requireRoles(['SUPER_ADMIN', 'CENTRAL_ADMIN']), getUsers);
router.post('/users', requireRoles(['SUPER_ADMIN']), createUser);

// Audit logs (Super Admin, Central Admin, Auditor)
router.get('/audit-logs', requireRoles(['SUPER_ADMIN', 'CENTRAL_ADMIN', 'AUDITOR']), getAuditLogs);

// System Settings
router.get('/settings', requireRoles(['SUPER_ADMIN', 'CENTRAL_ADMIN']), getSystemSettings);

// Demo Database Reset
router.post('/reset-demo', requireRoles(['SUPER_ADMIN', 'CENTRAL_ADMIN']), resetDemoDatabase);

export default router;
