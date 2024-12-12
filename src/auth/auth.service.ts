import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto'; // Для генерации OTP

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Неверный пароль');
    }

    const payload = { email: user.email, id: user.id, role: user.role };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }

  async register(name: string, email: string, password: string) {
    // Генерируем OTP
    const otp = randomInt(100000, 999999).toString();
    await this.mailService.sendOtp(email, otp);

    // Проверяем, существует ли пользователь с таким email
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }

    // Хешируем пароль перед сохранением
    const hashedPassword = await bcrypt.hash(password, 10);

    // Сохраняем пользователя с OTP и хешированным паролем
    const user = await this.userService.createUser(
      name,
      email,
      otp,
      hashedPassword,
    );

    return { message: 'OTP отправлен на почту', userId: user.id };
  }

  async verifyOtp(userId: string, otp: string) {
    const user = await this.userService.getUserById(userId);
    if (user.otp !== otp) {
      throw new BadRequestException('Неверный OTP');
    }

    // Подтверждаем регистрацию
    user.isVerified = true;
    await this.userService.updateUser(userId, { isVerified: true });
    return { message: 'Пользователь успешно зарегистрирован' };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Пользователь с таким email не найден');
    }

    const code = randomInt(100000, 999999).toString();
    await this.mailService.sendPasswordResetLink(email, code);

    // Сохраняем код для восстановления пароля в базе данных
    await this.userService.updateUser(user.id.toString(), {
      resetPasswordCode: code,
    });
    return {
      message: 'Ссылка для восстановления пароля отправлена на почту',
      userId: user.id.toString(),
    };
  }

  async resetPassword(userId: string, code: string, newPassword: string) {
    const user = await this.userService.getUserById(userId);
    if (user.resetPasswordCode !== code) {
      throw new BadRequestException('Неверный код восстановления');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userService.updateUser(userId, { password: hashedPassword });
    return { message: 'Пароль успешно обновлен' };
  }
}
