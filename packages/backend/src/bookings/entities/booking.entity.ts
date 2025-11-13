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
import { Pitch } from '../../pitches/entities/pitch.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  REFUNDED = 'refunded',
  FAILED = 'failed',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relationships
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  pitchId: string;

  @ManyToOne(() => Pitch, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pitchId' })
  pitch: Pitch;

  // Booking details
  @Column({ type: 'date' })
  bookingDate: Date;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column('int')
  durationHours: number;

  // Pricing
  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ default: 'EUR' })
  currency: string;

  // Status
  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  // Additional information
  @Column('text', { nullable: true })
  notes: string;

  @Column('int', { nullable: true })
  numberOfPlayers: number;

  // Cancellation
  @Column({ nullable: true })
  cancelledAt: Date;

  @Column('text', { nullable: true })
  cancellationReason: string;

  @Column({ type: 'uuid', nullable: true })
  cancelledBy: string;

  // Payment tracking
  @Column({ nullable: true })
  paymentIntentId: string;

  @Column({ nullable: true })
  refundId: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  refundAmount: number;

  // Confirmation
  @Column({ nullable: true })
  confirmedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
