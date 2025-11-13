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
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { SearchBookingDto } from './dto/search-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request (time conflict or invalid data)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Pitch not found' })
  create(@Request() req: any, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(req.user.userId, createBookingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user bookings with filters' })
  @ApiResponse({ status: 200, description: 'List of user bookings' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Request() req: any, @Query() searchDto: SearchBookingDto) {
    return this.bookingsService.findAll(req.user.userId, searchDto);
  }

  @Get('owner')
  @ApiOperation({ summary: 'Get bookings for pitch owner' })
  @ApiResponse({ status: 200, description: 'List of bookings for owned pitches' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findByOwner(@Request() req: any, @Query() searchDto: SearchBookingDto) {
    return this.bookingsService.findByPitchOwner(req.user.userId, searchDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking details by ID' })
  @ApiResponse({ status: 200, description: 'Booking details' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.bookingsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update booking details (pending bookings only)' })
  @ApiResponse({ status: 200, description: 'Booking updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingsService.update(id, req.user.userId, updateBookingDto);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Bad request (cancellation policy violation)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  cancel(
    @Param('id') id: string,
    @Request() req: any,
    @Body() cancelDto: CancelBookingDto,
  ) {
    return this.bookingsService.cancel(id, req.user.userId, cancelDto);
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirm a booking (pitch owners only)' })
  @ApiResponse({ status: 200, description: 'Booking confirmed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - only pitch owner can confirm' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  confirm(@Param('id') id: string, @Request() req: any) {
    return this.bookingsService.confirm(id, req.user.userId);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Mark booking as completed (pitch owners only)' })
  @ApiResponse({ status: 200, description: 'Booking completed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - only pitch owner can complete' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  complete(@Param('id') id: string, @Request() req: any) {
    return this.bookingsService.complete(id, req.user.userId);
  }
}
