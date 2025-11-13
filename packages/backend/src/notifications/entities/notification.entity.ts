import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
  BOOKING_CONFIRMED = 'booking_confirmed',
  BOOKING_CANCELLED = 'booking_cancelled',
  BOOKING_REMINDER = 'booking_reminder',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  PAYMENT_REFUND = 'payment_refund',
  MATCH_INVITATION = 'match_invitation',
  MATCH_CONFIRMED = 'match_confirmed',
  MATCH_CANCELLED = 'match_cancelled',
  MATCH_REMINDER = 'match_reminder',
  MATCH_RESULT = 'match_result',
  REVIEW_RECEIVED = 'review_received',
  REVIEW_RESPONSE = 'review_response',
  SYSTEM_ANNOUNCEMENT = 'system_announcement',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column('simple-json', { nullable: true })
  data: {
    [key: string]: any;
  };

  // URLs for deep linking
  @Column({ nullable: true })
  actionUrl: string;

  @Column({ nullable: true })
  imageUrl: string;

  // Status
  @Column({ default: false })
  read: boolean;

  @Column({ nullable: true })
  readAt: Date;

  @Column({ default: false })
  sent: boolean;

  @Column({ nullable: true })
  sentAt: Date;

  // Channel tracking
  @Column({ default: false })
  pushSent: boolean;

  @Column({ default: false })
  emailSent: boolean;

  @Column({ default: false })
  smsSent: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  expiresAt: Date;
}
