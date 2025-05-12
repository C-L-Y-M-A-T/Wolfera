import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async syncUser(
    id: string,
    {
      email,
      avatar_url,
      username,
    }: {
      email: string;
      username?: string;
      avatar_url?: string;
    },
  ): Promise<User> {
    console.log('Syncing user', id, email, avatar_url, username);
    // if user exists update it
    const existingUser = await this.userRepo.findOne({ where: { id } });
    if (existingUser) {
      existingUser.email = email || existingUser.email;
      existingUser.avatar_url = avatar_url || existingUser.avatar_url;
      existingUser.username = username || email.split('@')[0];
      return this.userRepo.save(existingUser);
    }

    // if user does not exist create it
    let finalUsername = username || email.split('@')[0];
    while (
      await this.userRepo.findOne({ where: { username: finalUsername } })
    ) {
      finalUsername += Math.floor(Math.random() * 10000);
    }
    const newUser = this.userRepo.create({
      id,
      email,
      username: finalUsername,
      avatar_url,
    });
    return this.userRepo.save(newUser);
  }

  async findById(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user; // or omit sensitive fields if needed
  }
}
