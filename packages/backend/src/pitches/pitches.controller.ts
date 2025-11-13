import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PitchesService } from './pitches.service';
import { CreatePitchDto } from './dto/create-pitch.dto';
import { UpdatePitchDto } from './dto/update-pitch.dto';
import { SearchPitchDto } from './dto/search-pitch.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PitchStatus } from './entities/pitch.entity';

@ApiTags('pitches')
@Controller('pitches')
export class PitchesController {
  constructor(private readonly pitchesService: PitchesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new pitch (pitch owners only)' })
  @ApiResponse({ status: 201, description: 'Pitch created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Request() req: any, @Body() createPitchDto: CreatePitchDto) {
    return this.pitchesService.create(req.user.userId, createPitchDto);
  }

  @Get()
  @ApiOperation({ summary: 'Search pitches with filters' })
  @ApiResponse({ status: 200, description: 'List of pitches' })
  findAll(@Query() searchDto: SearchPitchDto) {
    return this.pitchesService.findAll(searchDto);
  }

  @Get('my-pitches')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get pitches owned by the current user' })
  @ApiResponse({ status: 200, description: 'List of owned pitches' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findMyPitches(@Request() req: any) {
    return this.pitchesService.findByOwner(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get pitch details by ID' })
  @ApiResponse({ status: 200, description: 'Pitch details' })
  @ApiResponse({ status: 404, description: 'Pitch not found' })
  findOne(@Param('id') id: string) {
    return this.pitchesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update pitch details (owners only)' })
  @ApiResponse({ status: 200, description: 'Pitch updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Pitch not found' })
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updatePitchDto: UpdatePitchDto,
  ) {
    return this.pitchesService.update(id, req.user.userId, updatePitchDto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update pitch status (owners only)' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  updateStatus(
    @Param('id') id: string,
    @Request() req: any,
    @Body('status') status: PitchStatus,
  ) {
    return this.pitchesService.updateStatus(id, req.user.userId, status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete pitch (soft delete, owners only)' })
  @ApiResponse({ status: 204, description: 'Pitch deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Pitch not found' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.pitchesService.remove(id, req.user.userId);
  }
}
