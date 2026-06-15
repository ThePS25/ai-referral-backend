import { Referral } from '../models/Referral';
import { generateReferralContent } from './geminiService';
import { extractTextFromPdf, deleteFile } from '../utils/pdfParser';
import { GenerateReferralResponse } from '../types';

interface GenerateReferralInput {
  companyName: string;
  jobId: string;
  jobDescription: string;
  resumeLink: string;
  resumeFilePath: string;
}

export const processReferralGeneration = async (
  input: GenerateReferralInput,
): Promise<GenerateReferralResponse> => {
  const { companyName, jobId, jobDescription, resumeLink, resumeFilePath } = input;

  let resumeText: string;

  try {
    resumeText = await extractTextFromPdf(resumeFilePath);
  } finally {
    await deleteFile(resumeFilePath);
  }

  const generated = await generateReferralContent(
    companyName,
    jobId,
    jobDescription,
    resumeLink,
    resumeText,
  );

  await Referral.create({
    companyName,
    jobId,
    resumeLink,
    generatedReferral: generated.referralMessage,
    generatedLinkedInRequest: generated.linkedinRequest,
    generatedSummary: generated.candidateSummary,
  });

  return {
    referralMessage: generated.referralMessage,
    linkedinRequest: generated.linkedinRequest,
    candidateSummary: generated.candidateSummary,
  };
};
