import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { User } from '../user/user.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Получаем токен из заголовков
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new ForbiddenException('Токен не предоставлен');
    }

    try {
      // Проверка валидности JWT и присваивание информации из payload в request.user
      request.user = await this.jwtService.verifyAsync(token);
    } catch {
      throw new ForbiddenException('Неверный или просроченный токен');
    }

    // Получаем информацию о пользователе из request.user после декодирования токена
    const user = request.user as User;

    // Получаем ID из параметров маршрута
    const idFromParam = request.params.id;

    // Проверяем, если ID из токена совпадает с ID из параметра маршрута
    if (user.id === idFromParam) {
      return true; // Если ID совпадает, то доступ разрешен без проверки роли
    }

    // Получаем роль из декоратора, который может быть использован для определения требуемых ролей
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    // Проверка на роль, если ID не совпадает
    if (requiredRoles && !requiredRoles.some((role) => user.role === role)) {
      throw new ForbiddenException('Доступ запрещен');
    }

    // Проверка на совпадение ID пользователя с ID в параметре
    if (
      user.id.toString() !== idFromParam &&
      !['admin', 'superAdmin'].includes(user.role)
    ) {
      throw new ForbiddenException('У вас нет доступа к этому ресурсу');
    }

    return true;
  }
}
