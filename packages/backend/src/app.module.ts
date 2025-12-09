import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PitchesModule } from './pitches/pitches.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { ReviewsModule } from './reviews/reviews.module';
import { MatchesModule } from './matches/matches.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminModule } from './admin/admin.module';
import { AssistantModule } from './assistant/assistant.module';
import { User } from './users/entities/user.entity';
import { PlayerProfile } from './users/entities/player-profile.entity';
import { Pitch } from './pitches/entities/pitch.entity';
import { Booking } from './bookings/entities/booking.entity';
import { Payment } from './payments/entities/payment.entity';
import { Review, ReviewHelpfulness } from './reviews/entities/review.entity';
import { Match, MatchParticipant } from './matches/entities/match.entity';
import { Notification } from './notifications/entities/notification.entity';
import { AssistantConversation, AssistantMessage } from './assistant/entities/assistant.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [
          User,
          PlayerProfile,
          Pitch,
          Booking,
          Payment,
          Review,
          ReviewHelpfulness,
          Match,
          MatchParticipant,
          Notification,
          AssistantConversation,
          AssistantMessage,
        ],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    PitchesModule,
    BookingsModule,
    PaymentsModule,
    ReviewsModule,
    MatchesModule,
    NotificationsModule,
    AdminModule,
    AssistantModule,
  ],
})
export class AppModule {}
