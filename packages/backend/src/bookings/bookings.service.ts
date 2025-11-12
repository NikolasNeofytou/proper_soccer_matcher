import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Booking, BookingStatus, PaymentStatus } from './entities/booking.entity';
import { PitchesService } from '../pitches/pitches.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { SearchBookingDto } from './dto/search-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    private pitchesService: PitchesService,
  ) {}

  async create(userId: string, createBookingDto: CreateBookingDto): Promise<Booking> {
    const { pitchId, bookingDate, startTime, endTime, notes, numberOfPlayers } = createBookingDto;

    // Validate pitch exists
    const pitch = await this.pitchesService.findOne(pitchId);

    // Validate booking time
    const start = this.parseTime(startTime);
    const end = this.parseTime(endTime);
    
    if (end <= start) {
      throw new BadRequestException('End time must be after start time');
    }

    const durationHours = (end - start) / (1000 * 60 * 60);

    // Check for conflicts
    const hasConflict = await this.checkBookingConflict(
      pitchId,
      bookingDate,
      startTime,
      endTime,
    );

    if (hasConflict) {
      throw new BadRequestException('This time slot is already booked');
    }

    // Calculate total amount
    const totalAmount = this.calculateBookingAmount(pitch.hourlyRate, durationHours);

    // Create booking
    const booking = this.bookingsRepository.create({
      userId,
      pitchId,
      bookingDate: new Date(bookingDate),
      startTime,
      endTime,
      durationHours,
      totalAmount,
      currency: pitch.currency,
      notes,
      numberOfPlayers,
      status: BookingStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
    });

    return this.bookingsRepository.save(booking);
  }

  async findAll(
    userId: string,
    searchDto: SearchBookingDto,
  ): Promise<{ data: Booking[]; total: number; page: number; limit: number }> {
    const {
      status,
      paymentStatus,
      fromDate,
      toDate,
      pitchId,
      page = 1,
      limit = 10,
    } = searchDto;

    const queryBuilder = this.bookingsRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.pitch', 'pitch')
      .leftJoinAndSelect('booking.user', 'user')
      .where('booking.userId = :userId', { userId });

    // Status filter
    if (status) {
      queryBuilder.andWhere('booking.status = :status', { status });
    }

    if (paymentStatus) {
      queryBuilder.andWhere('booking.paymentStatus = :paymentStatus', { paymentStatus });
    }

    // Date range filter
    if (fromDate) {
      queryBuilder.andWhere('booking.bookingDate >= :fromDate', { fromDate });
    }
    if (toDate) {
      queryBuilder.andWhere('booking.bookingDate <= :toDate', { toDate });
    }

    // Pitch filter
    if (pitchId) {
      queryBuilder.andWhere('booking.pitchId = :pitchId', { pitchId });
    }

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Order by booking date and start time
    queryBuilder.orderBy('booking.bookingDate', 'DESC');
    queryBuilder.addOrderBy('booking.startTime', 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit };
  }

  async findByPitchOwner(
    ownerId: string,
    searchDto: SearchBookingDto,
  ): Promise<{ data: Booking[]; total: number; page: number; limit: number }> {
    const {
      status,
      paymentStatus,
      fromDate,
      toDate,
      pitchId,
      page = 1,
      limit = 10,
    } = searchDto;

    const queryBuilder = this.bookingsRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.pitch', 'pitch')
      .leftJoinAndSelect('booking.user', 'user')
      .where('pitch.ownerId = :ownerId', { ownerId });

    // Status filter
    if (status) {
      queryBuilder.andWhere('booking.status = :status', { status });
    }

    if (paymentStatus) {
      queryBuilder.andWhere('booking.paymentStatus = :paymentStatus', { paymentStatus });
    }

    // Date range filter
    if (fromDate) {
      queryBuilder.andWhere('booking.bookingDate >= :fromDate', { fromDate });
    }
    if (toDate) {
      queryBuilder.andWhere('booking.bookingDate <= :toDate', { toDate });
    }

    // Pitch filter
    if (pitchId) {
      queryBuilder.andWhere('booking.pitchId = :pitchId', { pitchId });
    }

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Order by booking date and start time
    queryBuilder.orderBy('booking.bookingDate', 'DESC');
    queryBuilder.addOrderBy('booking.startTime', 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: string, userId: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['pitch', 'user'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    // Check if user has access (either the booker or the pitch owner)
    const pitch = await this.pitchesService.findOne(booking.pitchId);
    if (booking.userId !== userId && pitch.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to view this booking');
    }

    return booking;
  }

  async update(id: string, userId: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOne(id, userId);

    // Only allow updates if booking is pending
    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Only pending bookings can be updated');
    }

    // Only the user who made the booking can update it
    if (booking.userId !== userId) {
      throw new ForbiddenException('You do not have permission to update this booking');
    }

    await this.bookingsRepository.update(id, updateBookingDto);
    return this.findOne(id, userId);
  }

  async cancel(id: string, userId: string, cancelDto: CancelBookingDto): Promise<Booking> {
    const booking = await this.findOne(id, userId);

    // Check if booking can be cancelled
    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }

    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Completed bookings cannot be cancelled');
    }

    // Check cancellation policy (minimum hours before booking)
    const pitch = await this.pitchesService.findOne(booking.pitchId);
    const bookingDateTime = this.combineDateAndTime(booking.bookingDate, booking.startTime);
    const hoursUntilBooking = (bookingDateTime.getTime() - Date.now()) / (1000 * 60 * 60);

    if (hoursUntilBooking < pitch.minCancellationHours) {
      throw new BadRequestException(
        `Cancellation must be made at least ${pitch.minCancellationHours} hours before booking`,
      );
    }

    // Update booking status
    await this.bookingsRepository.update(id, {
      status: BookingStatus.CANCELLED,
      cancelledAt: new Date(),
      cancelledBy: userId,
      cancellationReason: cancelDto.reason,
    });

    return this.findOne(id, userId);
  }

  async confirm(id: string, ownerId: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['pitch'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    // Check if user is the pitch owner
    const pitch = await this.pitchesService.findOne(booking.pitchId);
    if (pitch.ownerId !== ownerId) {
      throw new ForbiddenException('Only the pitch owner can confirm bookings');
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Only pending bookings can be confirmed');
    }

    await this.bookingsRepository.update(id, {
      status: BookingStatus.CONFIRMED,
      confirmedAt: new Date(),
    });

    const confirmedBooking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['pitch', 'user'],
    });

    if (!confirmedBooking) {
      throw new NotFoundException(`Booking with ID ${id} not found after confirmation`);
    }

    return confirmedBooking;
  }

  async complete(id: string, ownerId: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['pitch'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    // Check if user is the pitch owner
    const pitch = await this.pitchesService.findOne(booking.pitchId);
    if (pitch.ownerId !== ownerId) {
      throw new ForbiddenException('Only the pitch owner can complete bookings');
    }

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException('Only confirmed bookings can be completed');
    }

    await this.bookingsRepository.update(id, {
      status: BookingStatus.COMPLETED,
      completedAt: new Date(),
    });

    // Update pitch stats
    await this.pitchesService.update(booking.pitchId, ownerId, {
      totalBookings: pitch.totalBookings + 1,
    } as any);

    const completedBooking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['pitch', 'user'],
    });

    if (!completedBooking) {
      throw new NotFoundException(`Booking with ID ${id} not found after completion`);
    }

    return completedBooking;
  }

  // Helper methods
  private parseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date.getTime();
  }

  private combineDateAndTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const result = new Date(date);
    result.setHours(hours, minutes, 0, 0);
    return result;
  }

  private calculateBookingAmount(hourlyRate: number, durationHours: number): number {
    return Number((hourlyRate * durationHours).toFixed(2));
  }

  private async checkBookingConflict(
    pitchId: string,
    bookingDate: string,
    startTime: string,
    endTime: string,
    excludeBookingId?: string,
  ): Promise<boolean> {
    const queryBuilder = this.bookingsRepository
      .createQueryBuilder('booking')
      .where('booking.pitchId = :pitchId', { pitchId })
      .andWhere('booking.bookingDate = :bookingDate', { bookingDate })
      .andWhere('booking.status NOT IN (:...statuses)', {
        statuses: [BookingStatus.CANCELLED, BookingStatus.NO_SHOW],
      })
      .andWhere(
        '(booking.startTime < :endTime AND booking.endTime > :startTime)',
        { startTime, endTime },
      );

    if (excludeBookingId) {
      queryBuilder.andWhere('booking.id != :excludeBookingId', { excludeBookingId });
    }

    const count = await queryBuilder.getCount();
    return count > 0;
  }
}
