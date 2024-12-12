import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // 1. Получение всех пользователей
  async getUsers(): Promise<User[]> {
    console.log('Getting users');
    return this.userModel.find();
  }

  async createUser(
    name: string,
    email: string,
    otp: string,
    password: string,
  ): Promise<User> {
    const user = new this.userModel({
      name,
      email,
      otp,
      password,
      isVerified: false,
    });
    return user.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  // 2. Получение пользователя по ID
  async getUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // 3. Удаление пользователя по ID
  async deleteUser(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async updateUser(id: string, update: Partial<User>): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, update, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // 4. Фильтрация по ID (можно добавить свою логику фильтрации)
  async filterUsersById(ids: string[]): Promise<User[]> {
    return this.userModel.find({ _id: { $in: ids } }).exec();
  }
}
