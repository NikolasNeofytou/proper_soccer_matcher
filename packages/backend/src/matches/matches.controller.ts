import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { SearchMatchDto } from './dto/search-match.dto';
import { JoinMatchDto } from './dto/join-match.dto';
import { InvitePlayersDto } from './dto/invite-players.dto';
import { RecordMatchResultDto } from './dto/record-match-result.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('matches')
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new match' })
  @ApiResponse({ status: 201, description: 'Match created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Pitch or booking not found' })
  create(@Request() req: any, @Body() createMatchDto: CreateMatchDto) {
    return this.matchesService.create(req.user.userId, createMatchDto);
  }

  @Get()
  @ApiOperation({ summary: 'Search matches with filters' })
  @ApiResponse({ status: 200, description: 'List of matches' })
  findAll(@Query() searchDto: SearchMatchDto) {
    return this.matchesService.findAll(searchDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get match details by ID' })
  @ApiResponse({ status: 200, description: 'Match details' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  findOne(@Param('id') id: string) {
    return this.matchesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update match details (organizer only)' })
  @ApiResponse({ status: 200, description: 'Match updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the organizer' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updateMatchDto: UpdateMatchDto,
  ) {
    return this.matchesService.update(id, req.user.userId, updateMatchDto);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a match (organizer only)' })
  @ApiResponse({ status: 200, description: 'Match cancelled successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the organizer' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  cancel(@Param('id') id: string, @Request() req: any) {
    return this.matchesService.cancel(id, req.user.userId);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Join a match' })
  @ApiResponse({ status: 200, description: 'Successfully joined the match' })
  @ApiResponse({ status: 400, description: 'Bad request (match full, already joined, skill mismatch)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  joinMatch(
    @Param('id') id: string,
    @Request() req: any,
    @Body() joinDto: JoinMatchDto,
  ) {
    return this.matchesService.joinMatch(id, req.user.userId, joinDto);
  }

  @Post(':id/leave')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Leave a match' })
  @ApiResponse({ status: 200, description: 'Successfully left the match' })
  @ApiResponse({ status: 400, description: 'Bad request (organizer cannot leave, match in progress)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Match or participation not found' })
  leaveMatch(@Param('id') id: string, @Request() req: any) {
    return this.matchesService.leaveMatch(id, req.user.userId);
  }

  @Post(':id/invite')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Invite players to match (organizer only)' })
  @ApiResponse({ status: 200, description: 'Players invited successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the organizer' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  invitePlayers(
    @Param('id') id: string,
    @Request() req: any,
    @Body() inviteDto: InvitePlayersDto,
  ) {
    return this.matchesService.invitePlayers(id, req.user.userId, inviteDto);
  }

  @Post(':id/invitation/:accept')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Respond to match invitation' })
  @ApiResponse({ status: 200, description: 'Invitation response recorded' })
  @ApiResponse({ status: 400, description: 'Bad request (match full)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Invitation not found' })
  respondToInvitation(
    @Param('id') id: string,
    @Param('accept') accept: string,
    @Request() req: any,
  ) {
    return this.matchesService.respondToInvitation(id, req.user.userId, accept === 'true');
  }

  @Post(':id/balance-teams')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Auto-balance teams by skill level (organizer only)' })
  @ApiResponse({ status: 200, description: 'Teams balanced successfully' })
  @ApiResponse({ status: 400, description: 'Bad request (not enough players)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the organizer' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  balanceTeams(@Param('id') id: string, @Request() req: any) {
    return this.matchesService.balanceTeams(id, req.user.userId);
  }

  @Post(':id/result')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Record match result (organizer only)' })
  @ApiResponse({ status: 200, description: 'Result recorded successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the organizer' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  recordResult(
    @Param('id') id: string,
    @Request() req: any,
    @Body() resultDto: RecordMatchResultDto,
  ) {
    return this.matchesService.recordResult(id, req.user.userId, resultDto);
  }
}
