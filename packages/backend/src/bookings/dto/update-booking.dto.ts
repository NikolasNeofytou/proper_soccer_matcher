import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateBookingDto {
  @ApiPropertyOptional({ example: 'Updated notes for the booking' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  numberOfPlayers?: number;
}
