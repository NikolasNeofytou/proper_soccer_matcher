import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({ example: 'What are the available time slots for tomorrow?' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsOptional()
  pitchId?: string;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsOptional()
  conversationId?: string;
}

export class CheckAvailabilityDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  pitchId: string;

  @ApiProperty({ example: '2025-12-15' })
  @IsString()
  date: string;

  @ApiPropertyOptional({ example: '14:00' })
  @IsString()
  @IsOptional()
  startTime?: string;

  @ApiPropertyOptional({ example: '16:00' })
  @IsString()
  @IsOptional()
  endTime?: string;
}
