import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Pitch } from '../../pitches/entities/pitch.entity';

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export enum ConversationStatus {
  ACTIVE = 'active',
  RESOLVED = 'resolved',
  ESCALATED = 'escalated',
}

@Entity('assistant_conversations')
export class AssistantConversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid', nullable: true })
  pitchId: string;

  @ManyToOne(() => Pitch, { nullable: true })
  @JoinColumn({ name: 'pitchId' })
  pitch: Pitch;

  @Column({
    type: 'enum',
    enum: ConversationStatus,
    default: ConversationStatus.ACTIVE,
  })
  status: ConversationStatus;

  @Column({ nullable: true })
  title: string;

  @Column({ default: 0 })
  messageCount: number;

  @Column({ nullable: true })
  lastMessageAt: Date;

  @Column({ nullable: true })
  resolvedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('assistant_messages')
export class AssistantMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  conversationId: string;

  @ManyToOne(() => AssistantConversation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'conversationId' })
  conversation: AssistantConversation;

  @Column({
    type: 'enum',
    enum: MessageRole,
  })
  role: MessageRole;

  @Column('text')
  content: string;

  @Column('simple-json', { nullable: true })
  metadata: {
    intent?: string;
    confidence?: number;
    availabilityChecked?: boolean;
    bookingRecommendation?: any;
    [key: string]: any;
  };

  @CreateDateColumn()
  createdAt: Date;
}
