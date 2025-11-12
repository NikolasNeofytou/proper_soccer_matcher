import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsUUID, IsOptional, IsArray, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  pitchId: string;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsOptional()
  bookingId?: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Great pitch with excellent facilities!' })
  @IsString()
  comment: string;

  @ApiPropertyOptional({ example: 5, minimum: 1, maximum: 5 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  facilitiesRating?: number;

  @ApiPropertyOptional({ example: 5, minimum: 1, maximum: 5 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  locationRating?: number;

  @ApiPropertyOptional({ example: 4, minimum: 1, maximum: 5 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  valueRating?: number;

  @ApiPropertyOptional({ example: 5, minimum: 1, maximum: 5 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  surfaceQualityRating?: number;

  @ApiPropertyOptional({ example: ['https://example.com/image1.jpg'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
