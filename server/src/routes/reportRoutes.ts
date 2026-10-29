import { Router } from 'express';
import { getSummaryReport, exportApplicationsCsv } from '../controllers/reportController';
import { authenticateJwt } from '../middleware/auth';

const router = Router();

router.use(authenticateJwt);

router.get('/summary', getSummaryReport);
router.get('/export-csv', exportApplicationsCsv);

export default router;
