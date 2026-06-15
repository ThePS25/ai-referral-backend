import fs from 'fs/promises';
import pdfParse from 'pdf-parse';
import { AppError } from '../middleware/errorHandler';

export const extractTextFromPdf = async (filePath: string): Promise<string> => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text?.trim();

    if (!text) {
      throw new AppError('Could not extract text from the uploaded PDF', 400);
    }

    return text;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to parse PDF file', 400);
  }
};

export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    await fs.unlink(filePath);
  } catch {
    // Ignore cleanup errors
  }
};
