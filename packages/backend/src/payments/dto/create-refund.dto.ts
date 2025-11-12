import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsString, IsOptional, Min } from 'class-validator';

export class CreateRefundDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  paymentId: string;

  @ApiPropertyOptional({ example: 50.00, description: 'Amount to refund (leave empty for full refund)' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  amount?: number;

  @ApiPropertyOptional({ example: 'Customer requested cancellation' })
  @IsString()
  @IsOptional()
  reason?: string;
}
