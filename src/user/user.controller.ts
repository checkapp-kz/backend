import {
  Controller,
  Get,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 1. Получение всех пользователей
  @Get()
  async getUsers() {
    return this.userService.getUsers();
  }

  // 2. Получение конкретного пользователя по ID
  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'superAdmin')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  // 3. Удаление пользователя по ID
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  // 4. Фильтрация пользователей по ID (через query параметры)
  @Get('filter')
  async filterUsersById(@Query('ids') ids: string) {
    const idArray = ids.split(','); // ids передаются через запятую в URL
    return this.userService.filterUsersById(idArray);
  }
}
