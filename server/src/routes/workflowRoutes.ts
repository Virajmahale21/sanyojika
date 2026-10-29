import { Router } from 'express';
import {
  getWorkflowTemplates,
  advanceApplicationStage,
  raiseDeficiencyNotice,
  recordRegulatoryDecision,
} from '../controllers/workflowController';
import { authenticateJwt } from '../middleware/auth';

const router = Router();

router.use(authenticateJwt);

router.get('/templates', getWorkflowTemplates);
router.post('/applications/:id/advance', advanceApplicationStage);
router.post('/applications/:id/deficiency', raiseDeficiencyNotice);
router.post('/applications/:id/decision', recordRegulatoryDecision);

export default router;
