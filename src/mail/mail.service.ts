// mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo, Options } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter<SentMessageInfo, Options>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'batrbekk@gmail.com',
        pass: 'qoax uorr mlks glis',
      },
    });
  }

  async sendOtp(email: string, otp: string) {
    const mailOptions = {
      from: 'batrbekk@gmail.com',
      to: email,
      subject: 'Верификация OTP',
      text: `Ваш OTP-код для регистрации: ${otp}`,
    };
    await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetLink(email: string, code: string) {
    const resetLink = `https://checkapp.kz/auth/password-confirm?code=${code}&email=${email}`;
    const mailOptions = {
      from: 'batrbekk@gmail.com',
      to: email,
      subject: 'Восстановление пароля',
      text: `Перейдите по ссылке для восстановления пароля в Checkapp.kz: ${resetLink}`,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
