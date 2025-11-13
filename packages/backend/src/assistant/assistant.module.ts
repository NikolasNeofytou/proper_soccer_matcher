import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssistantService } from './assistant.service';
import { AssistantController } from './assistant.controller';
import { AssistantConversation, AssistantMessage } from './entities/assistant.entity';
import { Pitch } from '../pitches/entities/pitch.entity';
import { Booking } from '../bookings/entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AssistantConversation, AssistantMessage, Pitch, Booking])],
  controllers: [AssistantController],
  providers: [AssistantService],
  exports: [AssistantService],
})
export class AssistantModule {}
