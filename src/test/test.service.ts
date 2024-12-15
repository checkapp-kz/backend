// src/test/test.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test } from './test.model'; // Импортируем модель теста
import { User } from '../user/user.schema';
import { MailService } from '../mail/mail.service'; // Импортируем модель пользователя

@Injectable()
export class TestService {
  constructor(
    @InjectModel('Test') private readonly testModel: Model<Test>,
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly mailService: MailService,
  ) {}

  async sendPdfByEmail(
    to: string,
    subject: string,
    text: string,
    attachment: Buffer,
  ) {
    // Используем метод из MailService для отправки письма с PDF во вложении
    await this.mailService.sendMail({
      to,
      subject,
      text,
      attachments: [
        {
          filename: 'file.pdf', // Имя файла
          content: attachment, // PDF файл
        },
      ],
    });
  }

  // Сохранить тест с ответами
  async saveTest(userId: string, test: string, answers: any) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Создаем новый тест и сохраняем его в базе данных
    const newTest = new this.testModel({
      test,
      answers,
      userId,
      createdAt: new Date(),
    });

    await newTest.save();
    return { message: 'Test saved successfully', newTest };
  }

  // Получить тесты по id пользователя
  async getTestsByUserId(userId: string) {
    const tests = await this.testModel.find({ userId }).exec();

    if (!tests || tests.length === 0) {
      throw new Error('No tests found for this user');
    }

    return tests;
  }
}
