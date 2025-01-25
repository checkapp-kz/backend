import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from './review.model';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  private readonly logger = new Logger(ReviewService.name);

  constructor(
    @InjectModel('Review') private readonly reviewModel: Model<Review>,
  ) {}

  // Создание нового отзыва
  async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
    const newReview = new this.reviewModel(createReviewDto);
    return await newReview.save();
  }

  // Получение всех одобренных отзывов
  async getApprovedReviews(): Promise<Review[]> {
    return await this.reviewModel
      .find({ isApproved: true })
      .sort({ createdAt: -1 })
      .exec();
  }

  // Получение всех отзывов (для админа)
  async getAllReviews(): Promise<Review[]> {
    return await this.reviewModel.find().sort({ createdAt: -1 }).exec();
  }

  // Одобрение отзыва
  async approveReview(reviewId: string): Promise<Review> {
    this.logger.log(`Processing review approval for ID: ${reviewId}`);
    const result = await this.reviewModel.findByIdAndUpdate(
      reviewId,
      { isApproved: true },
      { new: true },
    );
    this.logger.log(`Review update result:`, result);
    return result;
  }

  // Удаление отзыва
  async deleteReview(reviewId: string): Promise<Review> {
    return await this.reviewModel.findByIdAndDelete(reviewId);
  }
}
