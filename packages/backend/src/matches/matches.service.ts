import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import {
  Match,
  MatchParticipant,
  MatchStatus,
  ParticipantStatus,
  Team,
} from './entities/match.entity';
import { PlayerProfile } from '../users/entities/player-profile.entity';
import { Pitch } from '../pitches/entities/pitch.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { SearchMatchDto } from './dto/search-match.dto';
import { JoinMatchDto } from './dto/join-match.dto';
import { InvitePlayersDto } from './dto/invite-players.dto';
import { RecordMatchResultDto } from './dto/record-match-result.dto';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    @InjectRepository(MatchParticipant)
    private participantsRepository: Repository<MatchParticipant>,
    @InjectRepository(PlayerProfile)
    private playerProfilesRepository: Repository<PlayerProfile>,
    @InjectRepository(Pitch)
    private pitchesRepository: Repository<Pitch>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) {}

  async create(organizerId: string, createMatchDto: CreateMatchDto): Promise<Match> {
    const { pitchId, bookingId, ...matchData } = createMatchDto;

    // Validate pitch exists
    const pitch = await this.pitchesRepository.findOne({ where: { id: pitchId } });
    if (!pitch) {
      throw new NotFoundException('Pitch not found');
    }

    // Validate booking if provided
    if (bookingId) {
      const booking = await this.bookingsRepository.findOne({
        where: { id: bookingId, userId: organizerId },
      });
      if (!booking) {
        throw new NotFoundException('Booking not found');
      }
      if (booking.pitchId !== pitchId) {
        throw new BadRequestException('Booking does not match the pitch');
      }
    }

    // Create match
    const match = this.matchesRepository.create({
      ...matchData,
      organizerId,
      pitchId,
      bookingId,
      currentPlayers: 1, // Organizer automatically joins
    });

    const savedMatch = await this.matchesRepository.save(match);

    // Add organizer as first participant
    await this.addParticipant(savedMatch.id, organizerId, {});

    return this.findOne(savedMatch.id);
  }

  async findAll(
    searchDto: SearchMatchDto,
  ): Promise<{ data: Match[]; total: number; page: number; limit: number }> {
    const {
      pitchId,
      fromDate,
      toDate,
      status = MatchStatus.OPEN,
      format,
      matchType,
      skillLevel,
      page = 1,
      limit = 10,
    } = searchDto;

    const queryBuilder = this.matchesRepository
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.pitch', 'pitch')
      .leftJoinAndSelect('match.organizer', 'organizer')
      .where('match.deletedAt IS NULL');

    // Filter by status
    if (status) {
      queryBuilder.andWhere('match.status = :status', { status });
    }

    // Filter by pitch
    if (pitchId) {
      queryBuilder.andWhere('match.pitchId = :pitchId', { pitchId });
    }

    // Date range
    if (fromDate) {
      queryBuilder.andWhere('match.matchDate >= :fromDate', { fromDate });
    }
    if (toDate) {
      queryBuilder.andWhere('match.matchDate <= :toDate', { toDate });
    }

    // Format filter
    if (format) {
      queryBuilder.andWhere('match.format = :format', { format });
    }

    // Match type filter
    if (matchType) {
      queryBuilder.andWhere('match.matchType = :matchType', { matchType });
    }

    // Skill level filter (player within range)
    if (skillLevel) {
      queryBuilder.andWhere(
        '(match.minSkillLevel IS NULL OR match.minSkillLevel <= :skillLevel)',
        { skillLevel },
      );
      queryBuilder.andWhere(
        '(match.maxSkillLevel IS NULL OR match.maxSkillLevel >= :skillLevel)',
        { skillLevel },
      );
    }

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Order by match date
    queryBuilder.orderBy('match.matchDate', 'ASC');
    queryBuilder.addOrderBy('match.startTime', 'ASC');

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Match> {
    const match = await this.matchesRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['pitch', 'organizer', 'participants', 'participants.player'],
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    return match;
  }

  async update(id: string, userId: string, updateMatchDto: UpdateMatchDto): Promise<Match> {
    const match = await this.findOne(id);

    // Only organizer can update
    if (match.organizerId !== userId) {
      throw new ForbiddenException('Only the match organizer can update the match');
    }

    // Cannot update completed or cancelled matches
    if (match.status === MatchStatus.COMPLETED || match.status === MatchStatus.CANCELLED) {
      throw new BadRequestException('Cannot update completed or cancelled matches');
    }

    await this.matchesRepository.update(id, updateMatchDto);
    return this.findOne(id);
  }

  async cancel(id: string, userId: string): Promise<Match> {
    const match = await this.findOne(id);

    // Only organizer can cancel
    if (match.organizerId !== userId) {
      throw new ForbiddenException('Only the match organizer can cancel the match');
    }

    await this.matchesRepository.update(id, {
      status: MatchStatus.CANCELLED,
    });

    return this.findOne(id);
  }

  async joinMatch(matchId: string, playerId: string, joinDto: JoinMatchDto): Promise<Match> {
    const match = await this.findOne(matchId);

    // Check if match is open for joining
    if (match.status !== MatchStatus.OPEN) {
      throw new BadRequestException('Match is not open for joining');
    }

    // Check if match is full
    if (match.currentPlayers >= match.maxPlayers) {
      throw new BadRequestException('Match is full');
    }

    // Check if player already joined
    const existingParticipant = await this.participantsRepository.findOne({
      where: { matchId, playerId },
    });

    if (existingParticipant) {
      throw new BadRequestException('You have already joined this match');
    }

    // Check skill level requirements
    const playerProfile = await this.playerProfilesRepository.findOne({
      where: { userId: playerId },
    });

    if (playerProfile) {
      if (match.minSkillLevel && playerProfile.skillLevel < match.minSkillLevel) {
        throw new BadRequestException('Your skill level is below the minimum requirement');
      }
      if (match.maxSkillLevel && playerProfile.skillLevel > match.maxSkillLevel) {
        throw new BadRequestException('Your skill level is above the maximum requirement');
      }
    }

    // Add participant
    await this.addParticipant(matchId, playerId, joinDto);

    // Update match player count and status
    const newPlayerCount = match.currentPlayers + 1;
    const newStatus = newPlayerCount >= match.maxPlayers ? MatchStatus.FULL : MatchStatus.OPEN;

    await this.matchesRepository.update(matchId, {
      currentPlayers: newPlayerCount,
      status: newStatus,
    });

    return this.findOne(matchId);
  }

  async leaveMatch(matchId: string, playerId: string): Promise<Match> {
    const match = await this.findOne(matchId);

    // Organizer cannot leave
    if (match.organizerId === playerId) {
      throw new BadRequestException('Match organizer cannot leave. Cancel the match instead.');
    }

    // Check if in progress or completed
    if (match.status === MatchStatus.IN_PROGRESS || match.status === MatchStatus.COMPLETED) {
      throw new BadRequestException('Cannot leave a match that is in progress or completed');
    }

    // Remove participant
    const participant = await this.participantsRepository.findOne({
      where: { matchId, playerId },
    });

    if (!participant) {
      throw new NotFoundException('You are not a participant of this match');
    }

    await this.participantsRepository.remove(participant);

    // Update match player count and status
    const newPlayerCount = match.currentPlayers - 1;
    await this.matchesRepository.update(matchId, {
      currentPlayers: newPlayerCount,
      status: newPlayerCount < match.maxPlayers ? MatchStatus.OPEN : match.status,
    });

    return this.findOne(matchId);
  }

  async invitePlayers(
    matchId: string,
    organizerId: string,
    inviteDto: InvitePlayersDto,
  ): Promise<Match> {
    const match = await this.findOne(matchId);

    // Only organizer can invite
    if (match.organizerId !== organizerId) {
      throw new ForbiddenException('Only the match organizer can invite players');
    }

    // Create invitations
    for (const playerId of inviteDto.playerIds) {
      const existingParticipant = await this.participantsRepository.findOne({
        where: { matchId, playerId },
      });

      if (!existingParticipant) {
        const participant = this.participantsRepository.create({
          matchId,
          playerId,
          status: ParticipantStatus.INVITED,
        });
        await this.participantsRepository.save(participant);
      }
    }

    return this.findOne(matchId);
  }

  async respondToInvitation(
    matchId: string,
    playerId: string,
    accept: boolean,
  ): Promise<Match> {
    const participant = await this.participantsRepository.findOne({
      where: { matchId, playerId, status: ParticipantStatus.INVITED },
    });

    if (!participant) {
      throw new NotFoundException('Invitation not found');
    }

    if (accept) {
      const match = await this.findOne(matchId);

      // Check if match is full
      if (match.currentPlayers >= match.maxPlayers) {
        throw new BadRequestException('Match is full');
      }

      // Accept invitation
      await this.participantsRepository.update(participant.id, {
        status: ParticipantStatus.CONFIRMED,
      });

      // Update match player count
      await this.matchesRepository.update(matchId, {
        currentPlayers: match.currentPlayers + 1,
        status: match.currentPlayers + 1 >= match.maxPlayers ? MatchStatus.FULL : match.status,
      });
    } else {
      // Decline invitation
      await this.participantsRepository.update(participant.id, {
        status: ParticipantStatus.DECLINED,
      });
    }

    return this.findOne(matchId);
  }

  async balanceTeams(matchId: string, organizerId: string): Promise<Match> {
    const match = await this.findOne(matchId);

    // Only organizer can balance teams
    if (match.organizerId !== organizerId) {
      throw new ForbiddenException('Only the match organizer can balance teams');
    }

    // Get all confirmed participants
    const participants = await this.participantsRepository.find({
      where: { matchId, status: ParticipantStatus.CONFIRMED },
      relations: ['player', 'player.playerProfile'],
    });

    if (participants.length < 2) {
      throw new BadRequestException('Need at least 2 players to balance teams');
    }

    // Sort by skill level
    const sortedParticipants = participants.sort((a, b) => {
      const skillA = a.player.playerProfile?.skillLevel || 3;
      const skillB = b.player.playerProfile?.skillLevel || 3;
      return skillB - skillA;
    });

    // Alternate assignment to balance teams
    for (let i = 0; i < sortedParticipants.length; i++) {
      const team = i % 2 === 0 ? Team.TEAM_A : Team.TEAM_B;
      await this.participantsRepository.update(sortedParticipants[i].id, { team });
    }

    await this.matchesRepository.update(matchId, { teamsAssigned: true });

    return this.findOne(matchId);
  }

  async recordResult(
    matchId: string,
    organizerId: string,
    resultDto: RecordMatchResultDto,
  ): Promise<Match> {
    const match = await this.findOne(matchId);

    // Only organizer can record result
    if (match.organizerId !== organizerId) {
      throw new ForbiddenException('Only the match organizer can record the result');
    }

    await this.matchesRepository.update(matchId, {
      teamAScore: resultDto.teamAScore,
      teamBScore: resultDto.teamBScore,
      status: MatchStatus.COMPLETED,
      completedAt: new Date(),
    });

    // Update player statistics
    await this.updatePlayerStatistics(matchId);

    return this.findOne(matchId);
  }

  private async addParticipant(
    matchId: string,
    playerId: string,
    joinDto: Partial<JoinMatchDto>,
  ): Promise<void> {
    const participant = this.participantsRepository.create({
      matchId,
      playerId,
      status: ParticipantStatus.CONFIRMED,
      position: joinDto.position,
      team: joinDto.preferredTeam || Team.UNASSIGNED,
    });

    await this.participantsRepository.save(participant);
  }

  private async updatePlayerStatistics(matchId: string): Promise<void> {
    const match = await this.findOne(matchId);

    if (!match.teamAScore || !match.teamBScore) {
      return;
    }

    const participants = match.participants.filter(
      (p) => p.status === ParticipantStatus.CONFIRMED,
    );

    for (const participant of participants) {
      const profile = await this.playerProfilesRepository.findOne({
        where: { userId: participant.playerId },
      });

      if (profile) {
        const isTeamA = participant.team === Team.TEAM_A;
        const teamScore = isTeamA ? match.teamAScore : match.teamBScore;
        const opponentScore = isTeamA ? match.teamBScore : match.teamAScore;

        const won = teamScore > opponentScore;
        const draw = teamScore === opponentScore;

        await this.playerProfilesRepository.update(profile.id, {
          totalMatches: profile.totalMatches + 1,
          wins: won ? profile.wins + 1 : profile.wins,
          draws: draw ? profile.draws + 1 : profile.draws,
          losses: !won && !draw ? profile.losses + 1 : profile.losses,
          goalsScored: profile.goalsScored + participant.goals,
          assists: profile.assists + participant.assists,
          cleanSheets: participant.cleanSheet ? profile.cleanSheets + 1 : profile.cleanSheets,
        });
      }
    }
  }
}
