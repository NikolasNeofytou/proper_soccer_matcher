import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('player_profiles')
export class PlayerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.playerProfile)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  gender: string;

  @Column({ type: 'int', default: 3 })
  skillLevel: number;

  @Column({ nullable: true })
  preferredPosition: string;

  @Column({ type: 'jsonb', default: '[]' })
  playStyle: string[];

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'int', nullable: true })
  heightCm: number;

  @Column({ type: 'int', nullable: true })
  weightKg: number;

  // Statistics
  @Column({ type: 'int', default: 0 })
  totalMatches: number;

  @Column({ type: 'int', default: 0 })
  wins: number;

  @Column({ type: 'int', default: 0 })
  losses: number;

  @Column({ type: 'int', default: 0 })
  draws: number;

  @Column({ type: 'int', default: 0 })
  goalsScored: number;

  @Column({ type: 'int', default: 0 })
  assists: number;

  @Column({ type: 'int', default: 0 })
  cleanSheets: number;

  // Preferences
  @Column({ default: true })
  notificationsEnabled: boolean;

  @Column({ default: true })
  locationPublic: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
