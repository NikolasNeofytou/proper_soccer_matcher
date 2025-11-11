import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PlayerProfile } from './entities/player-profile.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(PlayerProfile)
    private playerProfilesRepository: Repository<PlayerProfile>,
  ) {}

  async create(email: string, password: string, role: string = 'player'): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      passwordHash,
      role: role as any,
    });
    return this.usersRepository.save(user);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['playerProfile'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['playerProfile'],
    });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['playerProfile'],
    });
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, updateData);
    return this.findOne(id);
  }

  async createPlayerProfile(userId: string, profileData: Partial<PlayerProfile>): Promise<PlayerProfile> {
    const profile = this.playerProfilesRepository.create({
      ...profileData,
      userId,
    });
    return this.playerProfilesRepository.save(profile);
  }

  async updatePlayerProfile(userId: string, profileData: Partial<PlayerProfile>): Promise<PlayerProfile> {
    const profile = await this.playerProfilesRepository.findOne({ where: { userId } });
    if (!profile) {
      throw new NotFoundException(`Player profile for user ${userId} not found`);
    }
    await this.playerProfilesRepository.update(profile.id, profileData);
    return this.playerProfilesRepository.findOne({ where: { userId } });
  }
}
