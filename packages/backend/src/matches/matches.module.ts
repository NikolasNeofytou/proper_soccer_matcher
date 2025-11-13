import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { Match, MatchParticipant } from './entities/match.entity';
import { PlayerProfile } from '../users/entities/player-profile.entity';
import { Pitch } from '../pitches/entities/pitch.entity';
import { Booking } from '../bookings/entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Match, MatchParticipant, PlayerProfile, Pitch, Booking])],
  controllers: [MatchesController],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule {}
