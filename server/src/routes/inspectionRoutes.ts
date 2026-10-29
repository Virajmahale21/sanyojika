import { Router } from 'express';
import {
  getInspections,
  scheduleInspection,
  submitInspectionReport,
} from '../controllers/inspectionController';
import { authenticateJwt } from '../middleware/auth';

const router = Router();

router.use(authenticateJwt);

router.get('/', getInspections);
router.post('/schedule', scheduleInspection);
router.post('/:id/report', submitInspectionReport);

export default router;
