import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsArray,
  IsOptional,
  IsLatitude,
  IsLongitude,
  Min,
  IsObject,
} from 'class-validator';
import { SurfaceType } from '../entities/pitch.entity';

export class CreatePitchDto {
  @ApiProperty({ example: 'Downtown Soccer Arena' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Premium artificial turf pitch with excellent lighting' })
  @IsString()
  description: string;

  @ApiProperty({ example: '123 Main Street' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'London' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'UK' })
  @IsString()
  country: string;

  @ApiPropertyOptional({ example: 'SW1A 1AA' })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty({ example: 51.5074 })
  @IsLatitude()
  latitude: number;

  @ApiProperty({ example: -0.1278 })
  @IsLongitude()
  longitude: number;

  @ApiProperty({ enum: SurfaceType, example: SurfaceType.ARTIFICIAL_TURF })
  @IsEnum(SurfaceType)
  surfaceType: SurfaceType;

  @ApiProperty({ example: 10, description: 'Number of players (e.g., 10 for 5v5)' })
  @IsNumber()
  @Min(4)
  capacity: number;

  @ApiProperty({ example: 40, description: 'Length in meters' })
  @IsNumber()
  @Min(10)
  length: number;

  @ApiProperty({ example: 20, description: 'Width in meters' })
  @IsNumber()
  @Min(10)
  width: number;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  indoor?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  lighting?: boolean;

  @ApiPropertyOptional({ 
    example: ['changing_rooms', 'parking', 'showers'], 
    type: [String] 
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @ApiProperty({ example: 50.00 })
  @IsNumber()
  @Min(0)
  hourlyRate: number;

  @ApiPropertyOptional({ example: 75.00 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  peakHourRate?: number;

  @ApiPropertyOptional({ example: 'EUR' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({
    example: {
      monday: { open: '08:00', close: '22:00' },
      tuesday: { open: '08:00', close: '22:00' },
      wednesday: { open: '08:00', close: '22:00' },
      thursday: { open: '08:00', close: '22:00' },
      friday: { open: '08:00', close: '22:00' },
      saturday: { open: '09:00', close: '20:00' },
      sunday: { open: '09:00', close: '20:00' },
    },
  })
  @IsObject()
  @IsOptional()
  businessHours?: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };

  @ApiPropertyOptional({ example: 'No smoking. Football boots required.' })
  @IsString()
  @IsOptional()
  rules?: string;

  @ApiPropertyOptional({ example: 'Free cancellation up to 24 hours before booking' })
  @IsString()
  @IsOptional()
  cancellationPolicy?: string;

  @ApiPropertyOptional({ example: 24 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minCancellationHours?: number;

  @ApiPropertyOptional({ 
    example: ['https://example.com/image1.jpg'], 
    type: [String] 
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({ example: 'https://youtube.com/video' })
  @IsString()
  @IsOptional()
  videoUrl?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  instantBooking?: boolean;
}
