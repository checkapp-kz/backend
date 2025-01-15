import { Module } from '@nestjs/common';
import { FaqController } from './faq.controller';
import { FaqService } from './faq.service';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [FaqController],
  providers: [FaqService, MailService],
})
export class FaqModule {}
