import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const validateReferralRequest = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const { companyName, jobId, jobDescription, resumeLink } = req.body;

  if (!companyName?.trim()) {
    return next(new AppError('Company name is required', 400));
  }

  if (!jobId?.trim()) {
    return next(new AppError('Job ID is required', 400));
  }

  if (!jobDescription?.trim()) {
    return next(new AppError('Job description is required', 400));
  }

  if (!resumeLink?.trim()) {
    return next(new AppError('Resume link is required', 400));
  }

  try {
    new URL(resumeLink.trim());
  } catch {
    return next(new AppError('Resume link must be a valid URL', 400));
  }

  if (!req.file) {
    return next(new AppError('Resume PDF file is required', 400));
  }

  next();
};
