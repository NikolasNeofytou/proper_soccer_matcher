import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { SearchNotificationDto } from './dto/search-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationsRepository.create(createNotificationDto);
    return this.notificationsRepository.save(notification);
  }

  async createForUser(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: any,
    actionUrl?: string,
  ): Promise<Notification> {
    const notification = this.notificationsRepository.create({
      userId,
      type,
      title,
      message,
      data,
      actionUrl,
    });
    return this.notificationsRepository.save(notification);
  }

  async findAll(
    userId: string,
    searchDto: SearchNotificationDto,
  ): Promise<{ data: Notification[]; total: number; unreadCount: number; page: number; limit: number }> {
    const { type, read, page = 1, limit = 20 } = searchDto;

    const queryBuilder = this.notificationsRepository
      .createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId });

    // Type filter
    if (type) {
      queryBuilder.andWhere('notification.type = :type', { type });
    }

    // Read status filter
    if (read !== undefined) {
      queryBuilder.andWhere('notification.read = :read', { read });
    }

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Order by most recent first
    queryBuilder.orderBy('notification.createdAt', 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();

    // Get unread count
    const unreadCount = await this.notificationsRepository.count({
      where: { userId, read: false },
    });

    return { data, total, unreadCount, page, limit };
  }

  async findOne(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.findOne(id, userId);

    if (!notification.read) {
      await this.notificationsRepository.update(id, {
        read: true,
        readAt: new Date(),
      });
    }

    return this.findOne(id, userId);
  }

  async markAllAsRead(userId: string): Promise<{ affected: number }> {
    const result = await this.notificationsRepository.update(
      { userId, read: false },
      { read: true, readAt: new Date() },
    );

    return { affected: result.affected || 0 };
  }

  async delete(id: string, userId: string): Promise<void> {
    const notification = await this.findOne(id, userId);
    await this.notificationsRepository.remove(notification);
  }

  async deleteAll(userId: string): Promise<{ affected: number }> {
    const result = await this.notificationsRepository.delete({ userId });
    return { affected: result.affected || 0 };
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationsRepository.count({
      where: { userId, read: false },
    });
  }

  // Helper methods for creating specific notification types
  async notifyBookingConfirmed(userId: string, bookingId: string, pitchName: string, date: string): Promise<Notification> {
    return this.createForUser(
      userId,
      NotificationType.BOOKING_CONFIRMED,
      'Booking Confirmed',
      `Your booking at ${pitchName} for ${date} has been confirmed.`,
      { bookingId },
      `/bookings/${bookingId}`,
    );
  }

  async notifyMatchInvitation(userId: string, matchId: string, organizerName: string): Promise<Notification> {
    return this.createForUser(
      userId,
      NotificationType.MATCH_INVITATION,
      'Match Invitation',
      `${organizerName} has invited you to join a match.`,
      { matchId },
      `/matches/${matchId}`,
    );
  }

  async notifyReviewReceived(userId: string, reviewId: string, pitchName: string, rating: number): Promise<Notification> {
    return this.createForUser(
      userId,
      NotificationType.REVIEW_RECEIVED,
      'New Review',
      `Your pitch ${pitchName} received a ${rating}-star review.`,
      { reviewId },
      `/reviews/${reviewId}`,
    );
  }

  async notifyPaymentSuccess(userId: string, paymentId: string, amount: number, currency: string): Promise<Notification> {
    return this.createForUser(
      userId,
      NotificationType.PAYMENT_SUCCESS,
      'Payment Successful',
      `Your payment of ${amount} ${currency} was successful.`,
      { paymentId },
      `/payments/${paymentId}`,
    );
  }
}
