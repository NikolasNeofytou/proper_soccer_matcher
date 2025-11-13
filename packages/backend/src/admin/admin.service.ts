import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { User, UserStatus, UserRole } from '../users/entities/user.entity';
import { Pitch } from '../pitches/entities/pitch.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Review } from '../reviews/entities/review.entity';
import { Match } from '../matches/entities/match.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Pitch)
    private pitchesRepository: Repository<Pitch>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
  ) {}

  // User Management
  async getAllUsers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await this.usersRepository.findAndCount({
      relations: ['playerProfile'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data: users, total, page, limit };
  }

  async updateUserStatus(userId: string, status: UserStatus): Promise<User> {
    await this.usersRepository.update(userId, { status });
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['playerProfile'],
    });
    return user!;
  }

  async updateUserRole(userId: string, role: UserRole): Promise<User> {
    await this.usersRepository.update(userId, { role });
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['playerProfile'],
    });
    return user!;
  }

  async deleteUser(userId: string): Promise<void> {
    await this.usersRepository.update(userId, {
      status: UserStatus.DELETED,
      deletedAt: new Date(),
    });
  }

  // Pitch Management
  async getAllPitches(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [pitches, total] = await this.pitchesRepository.findAndCount({
      relations: ['owner'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data: pitches, total, page, limit };
  }

  async verifyPitch(pitchId: string, verified: boolean): Promise<Pitch> {
    await this.pitchesRepository.update(pitchId, { verified });
    const pitch = await this.pitchesRepository.findOne({
      where: { id: pitchId },
      relations: ['owner'],
    });
    return pitch!;
  }

  // Statistics
  async getPlatformStatistics() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      activeUsers,
      totalPitches,
      verifiedPitches,
      totalBookings,
      recentBookings,
      totalPayments,
      totalRevenue,
      totalMatches,
      totalReviews,
      averageRating,
    ] = await Promise.all([
      this.usersRepository.count(),
      this.usersRepository.count({ where: { status: UserStatus.ACTIVE } }),
      this.pitchesRepository.count(),
      this.pitchesRepository.count({ where: { verified: true } }),
      this.bookingsRepository.count(),
      this.bookingsRepository.count({
        where: {
          createdAt: Between(thirtyDaysAgo, now),
        },
      }),
      this.paymentsRepository.count(),
      this.paymentsRepository
        .createQueryBuilder('payment')
        .select('SUM(payment.amount)', 'total')
        .where('payment.status = :status', { status: 'succeeded' })
        .getRawOne()
        .then((result) => parseFloat(result.total || '0')),
      this.matchesRepository.count(),
      this.reviewsRepository.count(),
      this.reviewsRepository
        .createQueryBuilder('review')
        .select('AVG(review.rating)', 'average')
        .getRawOne()
        .then((result) => parseFloat(result.average || '0')),
    ]);

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        suspended: totalUsers - activeUsers,
      },
      pitches: {
        total: totalPitches,
        verified: verifiedPitches,
        unverified: totalPitches - verifiedPitches,
      },
      bookings: {
        total: totalBookings,
        last30Days: recentBookings,
      },
      payments: {
        total: totalPayments,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      },
      matches: {
        total: totalMatches,
      },
      reviews: {
        total: totalReviews,
        averageRating: parseFloat(averageRating.toFixed(2)),
      },
    };
  }

  // Recent Activity
  async getRecentActivity() {
    const limit = 20;

    const [recentUsers, recentBookings, recentPayments, recentReviews] = await Promise.all([
      this.usersRepository.find({
        order: { createdAt: 'DESC' },
        take: limit,
      }),
      this.bookingsRepository.find({
        relations: ['user', 'pitch'],
        order: { createdAt: 'DESC' },
        take: limit,
      }),
      this.paymentsRepository.find({
        relations: ['user', 'booking'],
        order: { createdAt: 'DESC' },
        take: limit,
      }),
      this.reviewsRepository.find({
        relations: ['user', 'pitch'],
        order: { createdAt: 'DESC' },
        take: limit,
      }),
    ]);

    return {
      recentUsers,
      recentBookings,
      recentPayments,
      recentReviews,
    };
  }

  // Content Moderation
  async getFlaggedReviews(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [reviews, total] = await this.reviewsRepository.findAndCount({
      where: { flagged: true },
      relations: ['user', 'pitch'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data: reviews, total, page, limit };
  }

  async moderateReview(reviewId: string, flagged: boolean, reason?: string): Promise<Review> {
    await this.reviewsRepository.update(reviewId, {
      flagged,
      flaggedReason: reason,
    });
    const review = await this.reviewsRepository.findOne({
      where: { id: reviewId },
      relations: ['user', 'pitch'],
    });
    return review!;
  }
}
