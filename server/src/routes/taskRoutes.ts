import { Router } from 'express';
import {
  getTasks,
  triggerEscalationScan,
  updateTaskStatus,
} from '../controllers/taskController';
import { authenticateJwt } from '../middleware/auth';

const router = Router();

router.use(authenticateJwt);

router.get('/', getTasks);
router.post('/escalate-scan', triggerEscalationScan);
router.patch('/:id/status', updateTaskStatus);

export default router;
