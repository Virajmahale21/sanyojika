import { Router } from 'express';
import {
  getComplianceRequirements,
  getComplianceSubmissions,
  submitComplianceEvidence,
  verifyComplianceSubmission,
} from '../controllers/complianceController';
import { authenticateJwt } from '../middleware/auth';

const router = Router();

router.use(authenticateJwt);

router.get('/requirements', getComplianceRequirements);
router.get('/submissions', getComplianceSubmissions);
router.post('/submissions/:id/evidence', submitComplianceEvidence);
router.post('/submissions/:id/verify', verifyComplianceSubmission);

export default router;
