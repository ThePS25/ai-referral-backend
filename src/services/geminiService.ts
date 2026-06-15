import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiGenerationResult } from '../types';
import { AppError } from '../middleware/errorHandler';

const MODEL_NAME = 'gemini-2.5-flash';

const buildPrompt = (
  companyName: string,
  jobId: string,
  jobDescription: string,
  resumeLink: string,
  resumeText: string,
): string => {
  return `You are an expert recruiter.

Analyze the candidate resume and job description below.

Generate exactly three pieces of content in JSON format:

1. "referralMessage" - A professional referral request message to send to a connection at the company. Mention the company name "${companyName}" naturally. Reference job ID "${jobId}" naturally. Include the resume link: ${resumeLink}. Sound human-written, warm, and professional.

2. "linkedinRequest" - A LinkedIn connection request message. MUST be under 300 characters. Mention the company and role interest briefly. Professional and concise.

3. "candidateSummary" - A one-line candidate summary highlighting relevant qualifications for this role.

STRICT REQUIREMENTS:
- Do NOT invent skills, experience, or qualifications not present in the resume.
- Only reference facts from the resume and job description.
- Keep a professional, human-written tone.
- Return ONLY valid JSON with keys: referralMessage, linkedinRequest, candidateSummary.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

RESUME LINK: ${resumeLink}
COMPANY: ${companyName}
JOB ID: ${jobId}`;
};

const parseGeminiResponse = (text: string): GeminiGenerationResult => {
  const jsonMatch = text.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new AppError('Failed to parse AI response', 500);
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]) as GeminiGenerationResult;

    if (!parsed.referralMessage || !parsed.linkedinRequest || !parsed.candidateSummary) {
      throw new Error('Missing required fields');
    }

    return {
      referralMessage: parsed.referralMessage.trim(),
      linkedinRequest: parsed.linkedinRequest.trim(),
      candidateSummary: parsed.candidateSummary.trim(),
    };
  } catch {
    throw new AppError('Invalid AI response format', 500);
  }
};

export const generateReferralContent = async (
  companyName: string,
  jobId: string,
  jobDescription: string,
  resumeLink: string,
  resumeText: string,
): Promise<GeminiGenerationResult> => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new AppError('Gemini API key is not configured', 500);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const prompt = buildPrompt(companyName, jobId, jobDescription, resumeLink, resumeText);

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    if (!text) {
      throw new AppError('Empty response from AI service', 500);
    }

    return parseGeminiResponse(text);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error('Gemini API error:', error);
    throw new AppError('Failed to generate referral content', 500);
  }
};
