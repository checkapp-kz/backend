import { Controller, Post, Body } from '@nestjs/common';
import { FaqService } from './faq.service';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Post()
  async sendFaqQuestion(
    @Body()
    body: {
      mail: string;
      description: string;
    },
  ) {
    await this.faqService.sendFaqQuestion(body.mail, body.description);
    return { message: 'FAQ question sent successfully' };
  }
}
