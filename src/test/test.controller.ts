// src/test/test.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { TestService } from './test.service';
import { FileInterceptor } from '@nestjs/platform-express';

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
  async saveTest(@Body() body: { userId: string; test: string; answers: any }) {
    return this.testService.saveTest(body.userId, body.test, body.answers);
  }

  @Get(':userId')
  async getTestsByUserId(@Param('userId') userId: string) {
    return this.testService.getTestsByUserId(userId);
  }
}
