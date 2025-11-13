import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class InvitePlayersDto {
  @ApiProperty({ 
    example: ['123e4567-e89b-12d3-a456-426614174000'], 
    type: [String],
    description: 'Array of player user IDs to invite'
  })
  @IsArray()
  @IsUUID('4', { each: true })
  playerIds: string[];
}
