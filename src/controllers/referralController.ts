import { Response, NextFunction } from 'express';
import { processReferralGeneration, getReferralsByUser } from '../services/referralService';
import { deleteFile } from '../utils/pdfParser';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const generateReferral = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const file = req.file;

  if (!req.user) {
    next(new AppError('Authentication required', 401));
    return;
  }

  if (!file) {
    next(new AppError('Resume file is required', 400));
    return;
  }

  try {
    const result = await processReferralGeneration({
      userId: String(req.user._id),
      companyName: req.body.companyName.trim(),
      jobId: req.body.jobId.trim(),
      jobDescription: req.body.jobDescription.trim(),
      resumeLink: req.body.resumeLink.trim(),
      resumeFilePath: file.path,
    });

    res.status(200).json(result);
  } catch (error) {
    await deleteFile(file.path);
    next(error);
  }
};

export const getMyReferrals = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const referrals = await getReferralsByUser(String(req.user._id));
    res.status(200).json({ referrals });
  } catch (error) {
    next(error);
  }
};
