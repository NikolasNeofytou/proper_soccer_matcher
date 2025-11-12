import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsEnum, IsBoolean, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { SurfaceType, PitchStatus } from '../entities/pitch.entity';

export class SearchPitchDto {
  @ApiPropertyOptional({ example: 'London' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: 'UK' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ example: 51.5074 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  latitude?: number;

  @ApiPropertyOptional({ example: -0.1278 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  longitude?: number;

  @ApiPropertyOptional({ example: 5, description: 'Radius in kilometers' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  radius?: number;

  @ApiPropertyOptional({ enum: SurfaceType })
  @IsEnum(SurfaceType)
  @IsOptional()
  surfaceType?: SurfaceType;

  @ApiPropertyOptional({ example: 10 })
  @IsNumber()
  @IsOptional()
  @Min(4)
  @Type(() => Number)
  minCapacity?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  minPrice?: number;

  @ApiPropertyOptional({ example: 100 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  maxPrice?: number;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  indoor?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  lighting?: boolean;

  @ApiPropertyOptional({ example: 'parking,changing_rooms' })
  @IsString()
  @IsOptional()
  amenities?: string;

  @ApiPropertyOptional({ enum: PitchStatus, default: PitchStatus.ACTIVE })
  @IsEnum(PitchStatus)
  @IsOptional()
  status?: PitchStatus;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({ example: 'name', enum: ['name', 'hourlyRate', 'averageRating', 'createdAt'] })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({ example: 'ASC', enum: ['ASC', 'DESC'] })
  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';
}
