import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum SurfaceType {
  NATURAL_GRASS = 'natural_grass',
  ARTIFICIAL_TURF = 'artificial_turf',
  INDOOR = 'indoor',
  HYBRID = 'hybrid',
}

export enum PitchStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
}

@Entity('pitches')
export class Pitch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({ type: 'uuid' })
  ownerId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  // Location
  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column('decimal', { precision: 10, scale: 7 })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 7 })
  longitude: number;

  // Pitch details
  @Column({
    type: 'enum',
    enum: SurfaceType,
    default: SurfaceType.ARTIFICIAL_TURF,
  })
  surfaceType: SurfaceType;

  @Column('int')
  capacity: number; // Number of players (e.g., 10 for 5v5, 14 for 7v7, etc.)

  @Column('decimal', { precision: 10, scale: 2 })
  length: number; // in meters

  @Column('decimal', { precision: 10, scale: 2 })
  width: number; // in meters

  @Column({ default: false })
  indoor: boolean;

  @Column({ default: false })
  lighting: boolean;

  // Amenities
  @Column('simple-array', { nullable: true })
  amenities: string[]; // ['changing_rooms', 'parking', 'showers', 'lockers', 'refreshments']

  // Pricing
  @Column('decimal', { precision: 10, scale: 2 })
  hourlyRate: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  peakHourRate: number;

  @Column({ default: 'EUR' })
  currency: string;

  // Business hours
  @Column('simple-json', { nullable: true })
  businessHours: {
    [key: string]: { open: string; close: string; closed?: boolean };
  }; // { "monday": { "open": "08:00", "close": "22:00" }, ... }

  // Rules and policies
  @Column('text', { nullable: true })
  rules: string;

  @Column('text', { nullable: true })
  cancellationPolicy: string;

  @Column('int', { default: 24 })
  minCancellationHours: number;

  // Media
  @Column('simple-array', { nullable: true })
  images: string[]; // URLs to images

  @Column({ nullable: true })
  videoUrl: string;

  // Stats
  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  averageRating: number;

  @Column('int', { default: 0 })
  totalReviews: number;

  @Column('int', { default: 0 })
  totalBookings: number;

  // Status
  @Column({
    type: 'enum',
    enum: PitchStatus,
    default: PitchStatus.ACTIVE,
  })
  status: PitchStatus;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: true })
  instantBooking: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;
}
