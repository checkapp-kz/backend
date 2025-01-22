import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { TestService } from '../test/test.service';
import { PaymentStatus } from '../test/enums/payment-status.enum';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly testService: TestService,
  ) {}

  @Post('create-payment')
  async createPayment(@Body() body: { testId: string; amount: number }) {
    const orderId = `TEST_${body.testId}_${Date.now()}`;
    const paymentResponse = await this.paymentService.generatePaymentLink(
      body.amount,
      orderId,
    );

    return { paymentResponse };
  }

  @Post('success-callback')
  async handleSuccessPayment(@Body() body: any) {
    const signature = body.sign;
    delete body.sign;

    if (!this.paymentService.verifyPaymentCallback(body, signature)) {
      throw new Error('Invalid signature');
    }

    const testId = body.orderId.split('_')[1]; // Извлекаем testId из orderId
    await this.testService.updatePaymentStatus(testId, PaymentStatus.PAYMENT);

    return { status: 'success' };
  }

  @Post('failure-callback')
  async handleFailurePayment(@Body() body: any) {
    const signature = body.sign;
    delete body.sign;

    if (!this.paymentService.verifyPaymentCallback(body, signature)) {
      throw new Error('Invalid signature');
    }

    // Можно добавить логику для обработки неуспешного платежа

    return { status: 'failure' };
  }
}
