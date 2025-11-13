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
import { Pitch } from '../../pitches/entities/pitch.entity';
import { Booking } from '../../bookings/entities/booking.entity';

export enum MatchType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  INVITE_ONLY = 'invite_only',
}

export enum MatchStatus {
  OPEN = 'open',
  FULL = 'full',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum MatchFormat {
  FIVE_V_FIVE = '5v5',
  SEVEN_V_SEVEN = '7v7',
  ELEVEN_V_ELEVEN = '11v11',
  FUTSAL = 'futsal',
}

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Match details
  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ type: 'uuid' })
  organizerId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

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

  // Match timing
  @Column({ type: 'date' })
  matchDate: Date;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  // Match configuration
  @Column({
    type: 'enum',
    enum: MatchFormat,
    default: MatchFormat.FIVE_V_FIVE,
  })
  format: MatchFormat;

  @Column({
    type: 'enum',
    enum: MatchType,
    default: MatchType.PUBLIC,
  })
  matchType: MatchType;

  @Column('int')
  maxPlayers: number;

  @Column('int', { default: 0 })
  currentPlayers: number;

  @Column('int', { nullable: true })
  minSkillLevel: number;

  @Column('int', { nullable: true })
  maxSkillLevel: number;

  // Cost per player
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  costPerPlayer: number;

  @Column({ default: 'EUR', nullable: true })
  currency: string;

  // Status
  @Column({
    type: 'enum',
    enum: MatchStatus,
    default: MatchStatus.OPEN,
  })
  status: MatchStatus;

  // Match result
  @Column('int', { nullable: true })
  teamAScore: number;

  @Column('int', { nullable: true })
  teamBScore: number;

  @Column({ nullable: true })
  completedAt: Date;

  // Team balancing
  @Column({ default: false })
  autoBalance: boolean;

  @Column({ default: false })
  teamsAssigned: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;

  @OneToMany(() => MatchParticipant, (participant) => participant.match)
  participants: MatchParticipant[];
}

export enum ParticipantStatus {
  INVITED = 'invited',
  CONFIRMED = 'confirmed',
  DECLINED = 'declined',
  CANCELLED = 'cancelled',
}

export enum Team {
  TEAM_A = 'team_a',
  TEAM_B = 'team_b',
  UNASSIGNED = 'unassigned',
}

@Entity('match_participants')
export class MatchParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  matchId: string;

  @ManyToOne(() => Match, (match) => match.participants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'matchId' })
  match: Match;

  @Column({ type: 'uuid' })
  playerId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'playerId' })
  player: User;

  // Participation status
  @Column({
    type: 'enum',
    enum: ParticipantStatus,
    default: ParticipantStatus.CONFIRMED,
  })
  status: ParticipantStatus;

  // Team assignment
  @Column({
    type: 'enum',
    enum: Team,
    default: Team.UNASSIGNED,
  })
  team: Team;

  @Column({ nullable: true })
  position: string;

  // Performance stats (for completed matches)
  @Column('int', { default: 0 })
  goals: number;

  @Column('int', { default: 0 })
  assists: number;

  @Column({ default: false })
  cleanSheet: boolean;

  @Column({ default: false })
  mvp: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
