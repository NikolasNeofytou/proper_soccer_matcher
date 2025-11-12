import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsUUID,
  IsDateString,
  IsOptional,
  Min,
  Matches,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  pitchId: string;

  @ApiProperty({ example: '2025-12-01', description: 'Booking date (YYYY-MM-DD)' })
  @IsDateString()
  bookingDate: string;

  @ApiProperty({ example: '14:00', description: 'Start time (HH:mm)' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Start time must be in format HH:mm',
  })
  startTime: string;

  @ApiProperty({ example: '16:00', description: 'End time (HH:mm)' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'End time must be in format HH:mm',
  })
  endTime: string;

  @ApiPropertyOptional({ example: 'Team practice session' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  numberOfPlayers?: number;
}
