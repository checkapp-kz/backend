// src/test/test.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import { PaymentStatus } from './enums/payment-status.enum';
import { TestType } from './enums/test-type.enum';

// Интерфейс для ответа
export interface Answer {
  id: string;
  answer: string | { weight: string; height: string };
}

// Интерфейс для теста
export interface Test extends Document {
  answers: Answer[];
  userId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  status: PaymentStatus;
  testType: TestType;
  pdfTemplate: string; // путь к шаблону PDF для конкретного типа теста
}

// Схема ответа
const AnswerSchema = new Schema<Answer>({
  id: { type: String, required: true },
  answer: { type: Schema.Types.Mixed, required: true },
});

// Схема теста
export const TestSchema = new Schema<Test>({
  answers: { type: [AnswerSchema], required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: PaymentStatus,
    default: PaymentStatus['NOT-PAYMENT'],
  },
  testType: {
    type: String,
    enum: TestType,
    required: true,
  },
  pdfTemplate: {
    type: String,
    required: true,
  },
});

// Модель теста
export const TestModel = mongoose.model<Test>('Test', TestSchema);
