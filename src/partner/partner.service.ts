import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

@Injectable()
export class PartnerService {
  constructor(private readonly mailService: MailService) {}

  async sendPartnerMessage(name: string, email: string, message: string) {
    return this.mailService.sendContactFromPartner(name, email, message);
  }
}
