import { Router } from 'express';
import { askAiAssistant } from '../controllers/aiController';
import { authenticateJwt } from '../middleware/auth';

const router = Router();

// Allow authenticated users to query assistant
router.post('/query', authenticateJwt, askAiAssistant);

export default router;
