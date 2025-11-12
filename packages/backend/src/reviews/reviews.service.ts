import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Review, ReviewHelpfulness } from './entities/review.entity';
import { Pitch } from '../pitches/entities/pitch.entity';
import { Booking, BookingStatus } from '../bookings/entities/booking.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { SearchReviewDto } from './dto/search-review.dto';
import { OwnerResponseDto } from './dto/owner-response.dto';
import { ReviewHelpfulnessDto } from './dto/review-helpfulness.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(ReviewHelpfulness)
    private helpfulnessRepository: Repository<ReviewHelpfulness>,
    @InjectRepository(Pitch)
    private pitchesRepository: Repository<Pitch>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) {}

  async create(userId: string, createReviewDto: CreateReviewDto): Promise<Review> {
    const { pitchId, bookingId, rating, comment, ...detailedRatings } = createReviewDto;

    // Validate pitch exists
    const pitch = await this.pitchesRepository.findOne({ where: { id: pitchId } });
    if (!pitch) {
      throw new NotFoundException('Pitch not found');
    }

    // Check if user has already reviewed this pitch
    const existingReview = await this.reviewsRepository.findOne({
      where: { userId, pitchId, deletedAt: IsNull() },
    });
    if (existingReview) {
      throw new BadRequestException('You have already reviewed this pitch');
    }

    // Validate booking if provided
    let verified = false;
    if (bookingId) {
      const booking = await this.bookingsRepository.findOne({
        where: { id: bookingId, userId },
      });
      if (!booking) {
        throw new NotFoundException('Booking not found');
      }
      if (booking.pitchId !== pitchId) {
        throw new BadRequestException('Booking does not match the pitch');
      }
      if (booking.status !== BookingStatus.COMPLETED) {
        throw new BadRequestException('You can only review completed bookings');
      }
      verified = true;
    }

    // Create review
    const review = this.reviewsRepository.create({
      userId,
      pitchId,
      bookingId,
      rating,
      comment,
      ...detailedRatings,
      verified,
    });

    const savedReview = await this.reviewsRepository.save(review);

    // Update pitch rating
    await this.updatePitchRating(pitchId);

    return savedReview;
  }

  async findAll(
    searchDto: SearchReviewDto,
  ): Promise<{ data: Review[]; total: number; page: number; limit: number }> {
    const { pitchId, userId, minRating, page = 1, limit = 10 } = searchDto;

    const queryBuilder = this.reviewsRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.pitch', 'pitch')
      .where('review.deletedAt IS NULL');

    if (pitchId) {
      queryBuilder.andWhere('review.pitchId = :pitchId', { pitchId });
    }

    if (userId) {
      queryBuilder.andWhere('review.userId = :userId', { userId });
    }

    if (minRating) {
      queryBuilder.andWhere('review.rating >= :minRating', { minRating });
    }

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Order by most recent first
    queryBuilder.orderBy('review.createdAt', 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewsRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['user', 'pitch', 'booking'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async update(id: string, userId: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.findOne(id);

    // Only the review author can update
    if (review.userId !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    await this.reviewsRepository.update(id, updateReviewDto);

    // Update pitch rating if rating changed
    if (updateReviewDto.rating) {
      await this.updatePitchRating(review.pitchId);
    }

    return this.findOne(id);
  }

  async remove(id: string, userId: string): Promise<void> {
    const review = await this.findOne(id);

    // Only the review author can delete
    if (review.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    // Soft delete
    await this.reviewsRepository.update(id, { deletedAt: new Date() });

    // Update pitch rating
    await this.updatePitchRating(review.pitchId);
  }

  async addOwnerResponse(
    id: string,
    ownerId: string,
    ownerResponseDto: OwnerResponseDto,
  ): Promise<Review> {
    const review = await this.reviewsRepository.findOne({
      where: { id },
      relations: ['pitch'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Verify user is the pitch owner
    if (review.pitch.ownerId !== ownerId) {
      throw new ForbiddenException('Only the pitch owner can respond to reviews');
    }

    await this.reviewsRepository.update(id, {
      ownerResponse: ownerResponseDto.response,
      ownerRespondedAt: new Date(),
    });

    return this.findOne(id);
  }

  async markHelpful(
    id: string,
    userId: string,
    helpfulnessDto: ReviewHelpfulnessDto,
  ): Promise<Review> {
    const review = await this.findOne(id);

    // Check if user already voted
    const existingVote = await this.helpfulnessRepository.findOne({
      where: { reviewId: id, userId },
    });

    if (existingVote) {
      // Update existing vote
      await this.helpfulnessRepository.update(existingVote.id, {
        helpful: helpfulnessDto.helpful,
      });
    } else {
      // Create new vote
      const vote = this.helpfulnessRepository.create({
        reviewId: id,
        userId,
        helpful: helpfulnessDto.helpful,
      });
      await this.helpfulnessRepository.save(vote);
    }

    // Recalculate helpful counts
    await this.updateHelpfulCounts(id);

    return this.findOne(id);
  }

  private async updatePitchRating(pitchId: string): Promise<void> {
    const result = await this.reviewsRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'averageRating')
      .addSelect('COUNT(review.id)', 'totalReviews')
      .where('review.pitchId = :pitchId', { pitchId })
      .andWhere('review.deletedAt IS NULL')
      .getRawOne();

    const averageRating = result.averageRating ? parseFloat(result.averageRating) : 0;
    const totalReviews = result.totalReviews ? parseInt(result.totalReviews, 10) : 0;

    await this.pitchesRepository.update(pitchId, {
      averageRating: parseFloat(averageRating.toFixed(2)),
      totalReviews,
    });
  }

  private async updateHelpfulCounts(reviewId: string): Promise<void> {
    const helpfulCount = await this.helpfulnessRepository.count({
      where: { reviewId, helpful: true },
    });

    const notHelpfulCount = await this.helpfulnessRepository.count({
      where: { reviewId, helpful: false },
    });

    await this.reviewsRepository.update(reviewId, {
      helpfulCount,
      notHelpfulCount,
    });
  }
}
