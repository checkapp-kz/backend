// src/test/test.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test } from './test.model';
import { User } from '../user/user.schema';
import { MailService } from '../mail/mail.service';
import { PaymentStatus } from './enums/payment-status.enum';
import { TestType } from './enums/test-type.enum';
import { MaleCheckupRecommendations } from './interfaces/male-checkup.interface';
import { PdfGeneratorService } from './services/pdf-generator.service';

@Injectable()
export class TestService {
  private readonly pdfTemplates = {
    [TestType.MALE_CHECKUP]: 'templates/male-checkup.pdf',
    [TestType.FEMALE_CHECKUP]: 'templates/female-checkup.pdf',
    [TestType.SPORT_CHECKUP]: 'templates/sport-checkup.pdf',
  };

  constructor(
    @InjectModel('Test') private readonly testModel: Model<Test>,
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly mailService: MailService,
    private readonly pdfGenerator: PdfGeneratorService,
  ) {}

  // Сохранить тест с ответами
  async saveTest(
    userId: string,
    answers: any,
    status: PaymentStatus,
    testType: TestType,
  ) {
    return await this.testModel.create({
      userId,
      answers,
      status,
      testType,
      pdfTemplate: this.pdfTemplates[testType],
    });
  }

  async updatePaymentStatus(testId: string, status: PaymentStatus) {
    const test = await this.testModel.findById(testId);
    if (!test) {
      throw new Error('Test not found');
    }

    // Находим пользователя по userId из теста
    const user = await this.userModel.findById(test.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Обновляем статус теста
    const updatedTest = await this.testModel.findByIdAndUpdate(
      testId,
      { status },
      { new: true },
    );

    // Генерируем PDF и отправляем на почту пользователя
    const pdfBuffer = await this.generateTestPdf(updatedTest);

    await this.sendPdfByEmail(
      user.email,
      `Your ${updatedTest.testType} Results`,
      'Please find your test results attached.',
      pdfBuffer,
    );

    return updatedTest;
  }

  private async generateTestPdf(test: Test): Promise<Buffer> {
    switch (test.testType) {
      case TestType.MALE_CHECKUP: {
        const recommendations = this.processMaleCheckupAnswers(test);
        return await this.pdfGenerator.generateMaleCheckupPdf(
          test,
          recommendations,
        );
      }
      // другие типы тестов...
      default:
        throw new Error('Unsupported test type');
    }
  }

  private processMaleCheckupAnswers(test: Test): MaleCheckupRecommendations {
    const recommendations: MaleCheckupRecommendations = {
      basicTests: [],
      additionalTests: [],
      consultations: [],
      measurements: [],
    };

    test.answers.forEach((answer) => {
      switch (answer.id) {
        case '1':
          this.processAgeAnswer(answer.answer as string, recommendations);
          break;
        case '2':
          const bmi = this.calculateBMI(
            answer.answer as { weight: string; height: string },
          );
          recommendations.bmi = bmi;
          if (bmi.category.includes('Ожирение')) {
            recommendations.additionalTests.push('гликированный гемоглобин');
            recommendations.consultations.push('консультация эндокринолога');
          }
          break;
        // ... остальные case
      }
    });

    return recommendations;
  }

  private calculateBMI(data: { weight: string; height: string }): {
    value: number;
    category: string;
  } {
    const weight = parseFloat(data.weight);
    const height = parseFloat(data.height) / 100; // переводим в метры
    const bmi = weight / (height * height);

    let category = '';
    if (bmi < 16) category = 'Выраженный дефицит массы тела';
    else if (bmi < 18.5) category = 'Недостаточная масса тела';
    else if (bmi < 25) category = 'Норма';
    else if (bmi < 30) category = 'Избыточная масса тела';
    else if (bmi < 35) category = 'Ожирение 1 степени';
    else if (bmi < 40) category = 'Ожирение 2 степени';
    else category = 'Ожирение 3 степени';

    return { value: bmi, category };
  }

  private processAgeAnswer(
    answer: string,
    recommendations: MaleCheckupRecommendations,
  ) {
    const ageTests = {
      a: ['общий анализ крови (ОАК)', 'УЗИ органов мошонки'],
      b: [
        'общий анализ крови (ОАК)',
        'ингибинB',
        'тестостерон',
        'ТТГ',
        'УЗИ органов мошонки',
      ],
      // ... добавить остальные возрастные категории
    };

    if (ageTests[answer]) {
      recommendations.basicTests.push(...ageTests[answer]);
    }
  }

  private generateFemaleCheckupPdf(doc: PDFKit.PDFDocument, test: Test) {
    doc.fontSize(25).text('Female Checkup Results', { align: 'center' });
    // Добавьте специфичную для женского чекапа логику генерации PDF
  }

  private generateSportCheckupPdf(doc: PDFKit.PDFDocument, test: Test) {
    doc.fontSize(25).text('Sport Checkup Results', { align: 'center' });
    // Добавьте специфичную для спортивного чекапа логику генерации PDF
  }

  async sendPdfByEmail(
    to: string,
    subject: string,
    text: string,
    attachment: Buffer,
  ) {
    await this.mailService.sendMail({
      to,
      subject,
      text,
      attachments: [
        {
          filename: 'test-results.pdf',
          content: attachment,
        },
      ],
    });
  }

  async getTestsByUserId(userId: string) {
    const tests = await this.testModel.find({ userId }).exec();
    if (!tests || tests.length === 0) {
      throw new Error('No tests found for this user');
    }
    return tests;
  }
}
