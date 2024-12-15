// src/test/test.model.ts
import mongoose, { Schema, Document } from 'mongoose';

// Интерфейс для ответа
export interface Answer {
  id: string;
  answer: string | { weight: string; height: string };
}

// Интерфейс для теста
export interface Test extends Document {
  test: string;
  answers: Answer[];
  userId: mongoose.Schema.Types.ObjectId; // Тип ObjectId для поля userId
  createdAt: Date;
}

// Схема ответа
const AnswerSchema = new Schema<Answer>({
  id: { type: String, required: true },
  answer: { type: Schema.Types.Mixed, required: true },
});

// Схема теста
export const TestSchema = new Schema<Test>({
  test: { type: String, required: true },
  answers: { type: [AnswerSchema], required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

// Модель теста
export const TestModel = mongoose.model<Test>('Test', TestSchema); // Создание модели Test
