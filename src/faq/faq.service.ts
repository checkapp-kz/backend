import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

@Injectable()
export class FaqService {
  constructor(private readonly mailService: MailService) {}

  async sendFaqQuestion(mail: string, description: string) {
    await this.mailService.sendFaqQuestionFromClient(mail, description);
  }
}
