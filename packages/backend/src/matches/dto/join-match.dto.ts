import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Team } from '../entities/match.entity';

export class JoinMatchDto {
  @ApiPropertyOptional({ example: 'Midfielder' })
  @IsString()
  @IsOptional()
  position?: string;

  @ApiPropertyOptional({ enum: Team })
  @IsEnum(Team)
  @IsOptional()
  preferredTeam?: Team;
}
