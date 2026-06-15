export interface GenerateReferralRequest {
  companyName: string;
  jobId: string;
  jobDescription: string;
  resumeLink: string;
}

export interface GenerateReferralResponse {
  referralMessage: string;
  linkedinRequest: string;
  candidateSummary: string;
}

export interface ReferralRecord {
  id: string;
  companyName: string;
  jobId: string;
  resumeLink: string;
  referralMessage: string;
  linkedinRequest: string;
  candidateSummary: string;
  createdAt: string;
}

export interface GeminiGenerationResult {
  referralMessage: string;
  linkedinRequest: string;
  candidateSummary: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
