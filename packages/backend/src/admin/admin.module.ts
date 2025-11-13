import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../users/entities/user.entity';
import { Pitch } from '../pitches/entities/pitch.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Review } from '../reviews/entities/review.entity';
import { Match } from '../matches/entities/match.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Pitch, Booking, Payment, Review, Match])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
