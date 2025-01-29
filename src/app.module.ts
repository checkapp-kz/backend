import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PartnerModule } from './partner/partner.module';
import { TestModule } from './test/test.module';
import { FaqModule } from './faq/faq.module';
import { ReviewModule } from './review/review.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.DATABASE_MONGO_URI || 'mongodb://checkapp:checkapp@localhost:27017/checkapp?authSource=checkapp',
    ),
    UserModule,
    AuthModule,
    PartnerModule,
    TestModule,
    FaqModule,
    ReviewModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
