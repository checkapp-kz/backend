// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '../user/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: '4ubRjQbEkhu/vAmtPRKNNCRelPNdc9+5C6+eIiqd/Vs=', // Убедитесь, что секретный ключ правильный
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.userService.getUserById(payload.id); // Получаем пользователя по ID
    if (!user) {
      throw new Error('Unauthorized');
    }
    return user; // Добавляем пользователя в request.user
  }
}
