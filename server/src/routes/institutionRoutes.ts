import { Router } from 'express';
import {
  getInstitutions,
  getInstitutionById,
  updateInstitution,
} from '../controllers/institutionController';
import { authenticateJwt } from '../middleware/auth';

const router = Router();

router.use(authenticateJwt);

router.get('/', getInstitutions);
router.get('/:id', getInstitutionById);
router.patch('/:id', updateInstitution);

export default router;
