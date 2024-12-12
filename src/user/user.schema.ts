import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Определяем тип для документа, чтобы его можно было использовать в сервисе
export type UserDocument = User & Document;

@Schema() // Декоратор для схемы
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop({ default: false })
  isVerified: boolean; // Поле для проверки подтверждения пользователя

  @Prop({ default: '' })
  otp: string; // Поле для OTP

  @Prop({ default: '' })
  resetPasswordCode: string; // Поле для кода восстановления пароля

  id: Types.ObjectId;
}

// Создаем фабрику схемы для работы с Mongoose
export const UserSchema = SchemaFactory.createForClass(User);
