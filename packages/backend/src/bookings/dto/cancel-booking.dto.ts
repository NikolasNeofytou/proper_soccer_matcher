import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CancelBookingDto {
  @ApiProperty({ example: 'Unable to attend due to weather conditions' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}
