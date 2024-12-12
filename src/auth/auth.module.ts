import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy'; // для авторизации через JWT

@Module({
  imports: [
    MailModule,
    JwtModule.register({
      secret: '4ubRjQbEkhu/vAmtPRKNNCRelPNdc9+5C6+eIiqd/Vs=', // используйте секрет для подписи токенов
      signOptions: { expiresIn: '7d' }, // JWT живет 7 дней
    }),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
