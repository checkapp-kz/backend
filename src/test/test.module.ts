// src/test/test.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { TestSchema } from './test.model'; // Импортируем только схему
import { UserModule } from '../user/user.module';
import { MailService } from '../mail/mail.service';
import { PdfGeneratorService } from './services/pdf-generator.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Test', schema: TestSchema }]), // Используем схему
    UserModule, // Импортируем UserModule для доступности модели User
  ],
  providers: [TestService, MailService, PdfGeneratorService],
  controllers: [TestController],
})
export class TestModule {}
