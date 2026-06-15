import mongoose, { Document, Schema } from 'mongoose';

export interface IReferral extends Document {
  companyName: string;
  jobId: string;
  resumeLink: string;
  generatedReferral: string;
  generatedLinkedInRequest: string;
  generatedSummary: string;
  createdAt: Date;
}

const referralSchema = new Schema<IReferral>(
  {
    companyName: { type: String, required: true, trim: true },
    jobId: { type: String, required: true, trim: true },
    resumeLink: { type: String, required: true, trim: true },
    generatedReferral: { type: String, required: true },
    generatedLinkedInRequest: { type: String, required: true },
    generatedSummary: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export const Referral = mongoose.model<IReferral>('Referral', referralSchema);
