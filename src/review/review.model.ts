import mongoose, { Schema, Document } from 'mongoose';

export interface Review extends Document {
  userName: string;
  text: string;
  createdAt: Date;
  isApproved: boolean;
}

export const ReviewSchema = new Schema<Review>({
  userName: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isApproved: { type: Boolean, default: false },
});

export const ReviewModel = mongoose.model<Review>('Review', ReviewSchema); 