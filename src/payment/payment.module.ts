import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TestModule } from '../test/test.module';

@Module({
  imports: [TestModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
