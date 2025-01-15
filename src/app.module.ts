import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PartnerModule } from './partner/partner.module';
import { TestModule } from './test/test.module';
import { FaqModule } from './faq/faq.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://batrbekk:kbekbe031198@main.7lggi.mongodb.net/?retryWrites=true&w=majority&appName=Main',
      {
        dbName: 'checkapp',
      },
    ),
    UserModule,
    AuthModule,
    PartnerModule,
    TestModule,
    FaqModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
