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

  async sendMail(mailOptions: {
    to: string;
    subject: string;
    text: string;
    attachments: any[];
  }) {
    const mailOptionsWithDefaults = {
      from: 'your-email@gmail.com', // Укажи свой email
      ...mailOptions,
    };

    await this.transporter.sendMail(mailOptionsWithDefaults);
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

  async sendPasswordResetLink(email: string, code: string, user_id: string) {
    const resetLink = `https://checkapp.kz/password-confirm?code=${code}&email=${email}&id=${user_id}`;
    const mailOptions = {
      from: 'batrbekk@gmail.com',
      to: email,
      subject: 'Восстановление пароля',
      text: `Перейдите по ссылке для восстановления пароля в Checkapp.kz: ${resetLink}`,
    };
    await this.transporter.sendMail(mailOptions);
  }

  async sendContactFromPartner(name: string, email: string, message: string) {
    const mailOptions = {
      from: 'batrbekk@gmail.com',
      to: 'batrbekk@gmail.com',
      subject: 'Сообщение от клиента',
      text: `Запрос на партнерство от ${name}, почта: ${email}, письмо: ${message}`,
    };
    await this.transporter.sendMail(mailOptions);
  }

  async sendFaqQuestionFromClient(clientEmail: string, description: string) {
    const mailOptions = {
      from: 'batrbekk@gmail.com',
      to: 'batrbekk@gmail.com',
      subject: 'Вопрос FAQ от клиента',
      text: `
Новый вопрос для FAQ:
От: ${clientEmail}
Вопрос: ${description}
      `,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
