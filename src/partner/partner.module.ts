import { Module } from '@nestjs/common';
import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.service';
import { MailService } from '../mail/mail.service'; // Импорт MailService

@Module({
  controllers: [PartnerController],
  providers: [PartnerService, MailService],
})
export class PartnerModule {}
