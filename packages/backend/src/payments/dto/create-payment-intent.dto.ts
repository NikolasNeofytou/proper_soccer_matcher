import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional } from 'class-validator';

export class CreatePaymentIntentDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  bookingId: string;

  @ApiPropertyOptional({ example: 'pm_1234567890' })
  @IsString()
  @IsOptional()
  paymentMethodId?: string;
}
