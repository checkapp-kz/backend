import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // Создание нового отзыва (только для авторизованных пользователей)
  @Post()
  async createReview(@Body() createReviewDto: CreateReviewDto) {
    return await this.reviewService.createReview(createReviewDto);
  }

  // Получение всех одобренных отзывов (публичный доступ)
  @Get()
  async getApprovedReviews() {
    return await this.reviewService.getApprovedReviews();
  }

  // Получение всех отзывов (для админа)
  @Get('admin/all')
  async getAllReviews() {
    return await this.reviewService.getAllReviews();
  }

  // Одобрение отзыва (для админа)
  @Patch('admin/approve/:id')
  async approveReview(@Param('id') id: string) {
    return await this.reviewService.approveReview(id);
  }

  // Удаление отзыва (для админа)
  @Delete('admin/:id')
  async deleteReview(@Param('id') id: string) {
    return await this.reviewService.deleteReview(id);
  }
}
