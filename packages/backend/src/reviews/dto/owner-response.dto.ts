import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OwnerResponseDto {
  @ApiProperty({ example: 'Thank you for your feedback! We appreciate your visit.' })
  @IsString()
  response: string;
}
