import { Router } from 'express';
import {
  getApplications,
  getApplicationById,
  createApplication,
  submitApplication,
} from '../controllers/applicationController';
import { authenticateJwt } from '../middleware/auth';

const router = Router();

router.use(authenticateJwt);

router.get('/', getApplications);
router.get('/:id', getApplicationById);
router.post('/', createApplication);
router.post('/:id/submit', submitApplication);

export default router;
