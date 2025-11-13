import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsObject, IsOptional } from 'class-validator';
import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  userId: string;

  @ApiProperty({ enum: NotificationType, example: NotificationType.BOOKING_CONFIRMED })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ example: 'Booking Confirmed' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Your booking has been confirmed for December 15th' })
  @IsString()
  message: string;

  @ApiProperty({ example: { bookingId: '123e4567-e89b-12d3-a456-426614174000' } })
  @IsObject()
  @IsOptional()
  data?: { [key: string]: any };

  @ApiProperty({ example: '/bookings/123' })
  @IsString()
  @IsOptional()
  actionUrl?: string;
}
