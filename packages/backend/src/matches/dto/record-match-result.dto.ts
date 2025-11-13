import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class RecordMatchResultDto {
  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(0)
  teamAScore: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(0)
  teamBScore: number;
}
