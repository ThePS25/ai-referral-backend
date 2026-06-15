import { Router } from 'express';
import { generateReferral, getMyReferrals } from '../controllers/referralController';
import { upload } from '../middleware/upload';
import { validateReferralRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/mine', getMyReferrals);

router.post(
  '/generate',
  upload.single('resumeFile'),
  validateReferralRequest,
  generateReferral,
);

export default router;
