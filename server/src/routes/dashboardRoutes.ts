import { Router } from 'express';
import { getDashboardMetrics } from '../controllers/dashboardController';
import { authenticateJwt } from '../middleware/auth';

const router = Router();

router.get('/metrics', authenticateJwt, getDashboardMetrics);

export default router;
