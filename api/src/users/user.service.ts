import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/utils/generic/base.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Badge, User } from './entities/user.entity';
import { AvatarConfigType, options } from './types/AvatarOptions';

@Injectable()
export class UsersService extends BaseService<
  User,
  CreateUserDto,
  UpdateUserDto,
  FilterUserDto
> {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    super(userRepo);
  }

  async syncUser(
    id: string,
    {
      email,
      username,
      avatar,
    }: {
      email: string;
      username?: string;
      avatar?: Record<keyof AvatarConfigType, number>;
    },
  ): Promise<User> {
    console.log('Syncing user', id, email, username);
    // if user exists update it
    const existingUser = await this.findOne({ id });
    if (existingUser) {
      const updatedData: UpdateUserDto = {
        username: username || existingUser.username || email.split('@')[0],
        avatarOptions: avatar || existingUser.avatarOptions,
      };
      return this.updateOne({ id }, updatedData);
    }

    // if user does not exist create it
    let finalUsername = username || email.split('@')[0];
    while (await this.findOne({ username: finalUsername })) {
      finalUsername += Math.floor(Math.random() * 10000);
    }
    const defaultAvatarOptions = Object.fromEntries(
      Object.keys(options).map((key) => [key, 0]),
    ) as Record<keyof AvatarConfigType, number>;
    const finalAvatar = avatar || defaultAvatarOptions;
    const newUserDto: CreateUserDto = {
      id,
      email,
      avatarOptions: finalAvatar,
      username: finalUsername,
    };

    return this.createOne(newUserDto);
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async awardBadges(user: User): Promise<User> {
    if (user.gamesWon >= 1 && !user.badges.includes(Badge.FIRST_WIN)) {
      user.badges.push(Badge.FIRST_WIN);
    }
    if (
      user.gamesAsWerewolf >= 1 &&
      !user.badges.includes(Badge.WEREWOLF_WIN)
    ) {
      user.badges.push(Badge.WEREWOLF_WIN);
    }
    if (
      user.gamesWon - user.gamesAsWerewolf >= 1 &&
      !user.badges.includes(Badge.VILLAGE_HERO)
    ) {
      user.badges.push(Badge.VILLAGE_HERO);
    }

    if (user.gamesPlayed >= 5 && !user.badges.includes(Badge.MOON_SURVIVOR)) {
      user.badges.push(Badge.MOON_SURVIVOR);
    }
    return this.userRepo.save(user);
  }
}
