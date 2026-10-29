import { Router } from 'express';
import authRoutes from './authRoutes';
import dashboardRoutes from './dashboardRoutes';
import applicationRoutes from './applicationRoutes';
import workflowRoutes from './workflowRoutes';
import documentRoutes from './documentRoutes';
import inspectionRoutes from './inspectionRoutes';
import complianceRoutes from './complianceRoutes';
import taskRoutes from './taskRoutes';
import notificationRoutes from './notificationRoutes';
import reportRoutes from './reportRoutes';
import institutionRoutes from './institutionRoutes';
import adminRoutes from './adminRoutes';
import aiRoutes from './aiRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/applications', applicationRoutes);
router.use('/workflow', workflowRoutes);
router.use('/documents', documentRoutes);
router.use('/inspections', inspectionRoutes);
router.use('/compliance', complianceRoutes);
router.use('/tasks', taskRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reports', reportRoutes);
router.use('/institutions', institutionRoutes);
router.use('/admin', adminRoutes);
router.use('/ai', aiRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'AICTE Integrated Approval, Compliance and Monitoring API Server',
    version: '2.6.2',
    timestamp: new Date().toISOString(),
  });
});

export default router;
