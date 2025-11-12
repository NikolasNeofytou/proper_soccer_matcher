import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ReviewHelpfulnessDto {
  @ApiProperty({ example: true, description: 'true for helpful, false for not helpful' })
  @IsBoolean()
  helpful: boolean;
}
