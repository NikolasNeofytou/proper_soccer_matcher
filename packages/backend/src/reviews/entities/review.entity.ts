import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Pitch } from '../../pitches/entities/pitch.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('reviews')
export class Review {
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

  @Column({ type: 'uuid', nullable: true })
  bookingId: string;

  @ManyToOne(() => Booking, { nullable: true })
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  // Review content
  @Column('int')
  rating: number; // 1-5 stars

  @Column('text')
  comment: string;

  // Detailed ratings
  @Column('int', { nullable: true })
  facilitiesRating: number;

  @Column('int', { nullable: true })
  locationRating: number;

  @Column('int', { nullable: true })
  valueRating: number;

  @Column('int', { nullable: true })
  surfaceQualityRating: number;

  // Helpful votes
  @Column('int', { default: 0 })
  helpfulCount: number;

  @Column('int', { default: 0 })
  notHelpfulCount: number;

  // Media
  @Column('simple-array', { nullable: true })
  images: string[];

  // Status
  @Column({ default: true })
  verified: boolean; // Verified if from actual booking

  @Column({ default: false })
  flagged: boolean;

  @Column({ nullable: true })
  flaggedReason: string;

  // Owner response
  @Column('text', { nullable: true })
  ownerResponse: string;

  @Column({ nullable: true })
  ownerRespondedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;

  @OneToMany(() => ReviewHelpfulness, (helpfulness) => helpfulness.review)
  helpfulnessVotes: ReviewHelpfulness[];
}

@Entity('review_helpfulness')
export class ReviewHelpfulness {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  reviewId: string;

  @ManyToOne(() => Review, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reviewId' })
  review: Review;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  helpful: boolean; // true for helpful, false for not helpful

  @CreateDateColumn()
  createdAt: Date;
}
