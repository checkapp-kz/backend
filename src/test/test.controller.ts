// src/test/test.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  Patch,
} from '@nestjs/common';
import { TestService } from './test.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaymentStatus } from './enums/payment-status.enum';
import { TestType } from './enums/test-type.enum';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  // для отправки PDF по email
  @Post('send-pdf')
  @UseInterceptors(FileInterceptor('file')) // Используем FileInterceptor для загрузки файла
  async sendPdf(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { to: string; subject: string; text: string },
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Получаем данные из body (получатель, тема письма, текст письма)
    const { to, subject, text } = body;

    // Вызываем метод из TestService для отправки PDF
    await this.testService.sendPdfByEmail(to, subject, text, file.buffer);

    return { message: 'PDF sent successfully' };
  }

  @Post('save')
  async saveTest(
    @Body()
    body: {
      userId: string;
      answers: any;
      testType: TestType;
    },
  ) {
    return this.testService.saveTest(
      body.userId,
      body.answers,
      PaymentStatus['NOT-PAYMENT'],
      body.testType,
    );
  }

  @Patch(':testId/update-payment-status')
  async updatePaymentStatus(@Param('testId') testId: string) {
    const updatedTest = await this.testService.updatePaymentStatus(
      testId,
      PaymentStatus.PAYMENT,
    );
    return {
      message: 'Payment status updated and test sent to email',
      test: updatedTest,
    };
  }

  @Get(':userId')
  async getTestsByUserId(@Param('userId') userId: string) {
    return this.testService.getTestsByUserId(userId);
  }
}
