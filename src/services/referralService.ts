import { Referral } from '../models/Referral';
import { generateReferralContent } from './geminiService';
import { extractTextFromPdf, deleteFile } from '../utils/pdfParser';
import { GenerateReferralResponse, ReferralRecord } from '../types';

interface GenerateReferralInput {
  userId: string;
  companyName: string;
  jobId: string;
  jobDescription: string;
  resumeLink: string;
  resumeFilePath: string;
}

const formatReferral = (referral: {
  _id: unknown;
  companyName: string;
  jobId: string;
  resumeLink: string;
  generatedReferral: string;
  generatedLinkedInRequest: string;
  generatedSummary: string;
  createdAt: Date;
}): ReferralRecord => ({
  id: String(referral._id),
  companyName: referral.companyName,
  jobId: referral.jobId,
  resumeLink: referral.resumeLink,
  referralMessage: referral.generatedReferral,
  linkedinRequest: referral.generatedLinkedInRequest,
  candidateSummary: referral.generatedSummary,
  createdAt: referral.createdAt.toISOString(),
});

export const processReferralGeneration = async (
  input: GenerateReferralInput,
): Promise<ReferralRecord> => {
  const { userId, companyName, jobId, jobDescription, resumeLink, resumeFilePath } = input;

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

  const referral = await Referral.create({
    user: userId,
    companyName,
    jobId,
    resumeLink,
    generatedReferral: generated.referralMessage,
    generatedLinkedInRequest: generated.linkedinRequest,
    generatedSummary: generated.candidateSummary,
  });

  return formatReferral(referral);
};

export const getReferralsByUser = async (userId: string): Promise<ReferralRecord[]> => {
  const referrals = await Referral.find({ user: userId })
    .sort({ createdAt: -1 })
    .lean();

  return referrals.map(formatReferral);
};
