import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Pitch, PitchStatus } from './entities/pitch.entity';
import { CreatePitchDto } from './dto/create-pitch.dto';
import { UpdatePitchDto } from './dto/update-pitch.dto';
import { SearchPitchDto } from './dto/search-pitch.dto';

@Injectable()
export class PitchesService {
  constructor(
    @InjectRepository(Pitch)
    private pitchesRepository: Repository<Pitch>,
  ) {}

  async create(ownerId: string, createPitchDto: CreatePitchDto): Promise<Pitch> {
    const pitch = this.pitchesRepository.create({
      ...createPitchDto,
      ownerId,
    });
    return this.pitchesRepository.save(pitch);
  }

  async findAll(searchDto: SearchPitchDto): Promise<{ data: Pitch[]; total: number; page: number; limit: number }> {
    const {
      city,
      country,
      latitude,
      longitude,
      radius,
      surfaceType,
      minCapacity,
      minPrice,
      maxPrice,
      indoor,
      lighting,
      amenities,
      status = PitchStatus.ACTIVE,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = searchDto;

    const queryBuilder = this.pitchesRepository.createQueryBuilder('pitch');

    // Only show active pitches by default
    queryBuilder.where('pitch.status = :status', { status });
    queryBuilder.andWhere('pitch.deletedAt IS NULL');

    // Location filters
    if (city) {
      queryBuilder.andWhere('LOWER(pitch.city) LIKE LOWER(:city)', { city: `%${city}%` });
    }
    if (country) {
      queryBuilder.andWhere('LOWER(pitch.country) LIKE LOWER(:country)', { country: `%${country}%` });
    }

    // Radius search (simplified - in production, use PostGIS or similar)
    if (latitude && longitude && radius) {
      // Approximate distance calculation (1 degree ≈ 111km)
      const latDiff = radius / 111;
      const lonDiff = radius / (111 * Math.cos(latitude * Math.PI / 180));
      
      queryBuilder.andWhere(
        'pitch.latitude BETWEEN :minLat AND :maxLat',
        { minLat: latitude - latDiff, maxLat: latitude + latDiff }
      );
      queryBuilder.andWhere(
        'pitch.longitude BETWEEN :minLon AND :maxLon',
        { minLon: longitude - lonDiff, maxLon: longitude + lonDiff }
      );
    }

    // Pitch characteristics
    if (surfaceType) {
      queryBuilder.andWhere('pitch.surfaceType = :surfaceType', { surfaceType });
    }
    if (minCapacity) {
      queryBuilder.andWhere('pitch.capacity >= :minCapacity', { minCapacity });
    }
    if (indoor !== undefined) {
      queryBuilder.andWhere('pitch.indoor = :indoor', { indoor });
    }
    if (lighting !== undefined) {
      queryBuilder.andWhere('pitch.lighting = :lighting', { lighting });
    }

    // Price range
    if (minPrice !== undefined) {
      queryBuilder.andWhere('pitch.hourlyRate >= :minPrice', { minPrice });
    }
    if (maxPrice !== undefined) {
      queryBuilder.andWhere('pitch.hourlyRate <= :maxPrice', { maxPrice });
    }

    // Amenities filter
    if (amenities) {
      const amenitiesList = amenities.split(',').map(a => a.trim());
      amenitiesList.forEach((amenity, index) => {
        queryBuilder.andWhere(
          `LOWER(CAST(pitch.amenities AS text)) LIKE LOWER(:amenity${index})`,
          { [`amenity${index}`]: `%${amenity}%` }
        );
      });
    }

    // Sorting
    const allowedSortFields = ['name', 'hourlyRate', 'averageRating', 'createdAt'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    queryBuilder.orderBy(`pitch.${sortField}`, sortOrder);

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Execute query
    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Pitch> {
    const pitch = await this.pitchesRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['owner'],
    });

    if (!pitch) {
      throw new NotFoundException(`Pitch with ID ${id} not found`);
    }

    return pitch;
  }

  async findByOwner(ownerId: string): Promise<Pitch[]> {
    return this.pitchesRepository.find({
      where: { ownerId, deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, ownerId: string, updatePitchDto: UpdatePitchDto): Promise<Pitch> {
    const pitch = await this.findOne(id);

    // Check ownership
    if (pitch.ownerId !== ownerId) {
      throw new ForbiddenException('You do not have permission to update this pitch');
    }

    await this.pitchesRepository.update(id, updatePitchDto);
    return this.findOne(id);
  }

  async remove(id: string, ownerId: string): Promise<void> {
    const pitch = await this.findOne(id);

    // Check ownership
    if (pitch.ownerId !== ownerId) {
      throw new ForbiddenException('You do not have permission to delete this pitch');
    }

    // Soft delete
    await this.pitchesRepository.update(id, { deletedAt: new Date() });
  }

  async updateStatus(id: string, ownerId: string, status: PitchStatus): Promise<Pitch> {
    const pitch = await this.findOne(id);

    // Check ownership
    if (pitch.ownerId !== ownerId) {
      throw new ForbiddenException('You do not have permission to update this pitch');
    }

    await this.pitchesRepository.update(id, { status });
    return this.findOne(id);
  }
}
