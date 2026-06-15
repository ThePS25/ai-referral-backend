import { Router } from 'express';
import { generateReferral } from '../controllers/referralController';
import { upload } from '../middleware/upload';
import { validateReferralRequest } from '../middleware/validateRequest';

const router = Router();

router.post(
  '/generate',
  upload.single('resumeFile'),
  validateReferralRequest,
  generateReferral,
);

export default router;
