import { Router } from 'express';
import { login, getProfile, updateLanguagePreference, getDemoAccounts } from '../controllers/authController';
import { authenticateJwt } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.get('/me', authenticateJwt, getProfile);
router.post('/language', authenticateJwt, updateLanguagePreference);
router.get('/demo-accounts', getDemoAccounts);

export default router;
