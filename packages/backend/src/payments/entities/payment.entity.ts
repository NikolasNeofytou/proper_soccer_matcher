import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Booking } from '../../bookings/entities/booking.entity';

export enum PaymentMethod {
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
  WALLET = 'wallet',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
  CANCELLED = 'cancelled',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relationships
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  bookingId: string;

  @ManyToOne(() => Booking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  // Payment details
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'EUR' })
  currency: string;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CARD,
  })
  paymentMethod: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  // Stripe references
  @Column({ nullable: true })
  stripePaymentIntentId: string;

  @Column({ nullable: true })
  stripeChargeId: string;

  @Column({ nullable: true })
  stripeCustomerId: string;

  @Column({ nullable: true })
  stripePaymentMethodId: string;

  // Refund information
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  refundedAmount: number;

  @Column('simple-array', { nullable: true })
  refundIds: string[];

  @Column({ nullable: true })
  refundedAt: Date;

  // Metadata
  @Column('simple-json', { nullable: true })
  metadata: {
    [key: string]: any;
  };

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { nullable: true })
  failureMessage: string;

  // Timestamps
  @Column({ nullable: true })
  succeededAt: Date;

  @Column({ nullable: true })
  failedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
