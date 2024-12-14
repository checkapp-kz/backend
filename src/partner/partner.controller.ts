import { Controller, Post, Body } from '@nestjs/common';
import { PartnerService } from './partner.service';

@Controller('partner')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post('contact')
  async sendPartnerMessage(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('message') message: string,
  ) {
    return this.partnerService.sendPartnerMessage(name, email, message);
  }
}
