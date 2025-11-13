import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsUUID,
  IsEnum,
  IsDateString,
  IsOptional,
  IsBoolean,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { MatchType, MatchFormat } from '../entities/match.entity';

export class CreateMatchDto {
  @ApiProperty({ example: 'Friendly 5v5 Match' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Looking for players for a friendly match' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  pitchId: string;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsOptional()
  bookingId?: string;

  @ApiProperty({ example: '2025-12-15', description: 'Match date (YYYY-MM-DD)' })
  @IsDateString()
  matchDate: string;

  @ApiProperty({ example: '18:00', description: 'Start time (HH:mm)' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Start time must be in format HH:mm',
  })
  startTime: string;

  @ApiProperty({ example: '20:00', description: 'End time (HH:mm)' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'End time must be in format HH:mm',
  })
  endTime: string;

  @ApiProperty({ enum: MatchFormat, example: MatchFormat.FIVE_V_FIVE })
  @IsEnum(MatchFormat)
  format: MatchFormat;

  @ApiProperty({ enum: MatchType, example: MatchType.PUBLIC })
  @IsEnum(MatchType)
  matchType: MatchType;

  @ApiProperty({ example: 10, description: 'Maximum number of players' })
  @IsNumber()
  @Min(4)
  @Max(30)
  maxPlayers: number;

  @ApiPropertyOptional({ example: 1, minimum: 1, maximum: 7 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(7)
  minSkillLevel?: number;

  @ApiPropertyOptional({ example: 7, minimum: 1, maximum: 7 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(7)
  maxSkillLevel?: number;

  @ApiPropertyOptional({ example: 10.00 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  costPerPlayer?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  autoBalance?: boolean;
}
