import { Request, Response, NextFunction } from 'express';
import { processReferralGeneration } from '../services/referralService';
import { deleteFile } from '../utils/pdfParser';

export const generateReferral = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const file = req.file;

  if (!file) {
    next(new Error('Resume file is required'));
    return;
  }

  try {
    const result = await processReferralGeneration({
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
