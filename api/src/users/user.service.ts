import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/utils/generic/base.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Badge, User } from './entities/user.entity';

@Injectable()
export class UsersService extends BaseService<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    super(userRepo);
  }

  // async syncUser(
  //   id: string,
  //   {
  //     email,
  //     avatar_url,
  //     username,
  //   }: {
  //     email: string;
  //     username?: string;
  //     avatar_url?: string;
  //   },
  // ): Promise<User> {
  //   console.log('Syncing user', id, email, avatar_url, username);
  //   // if user exists update it
  //   const existingUser = await this.userRepo.findOne({ where: { id } });
  //   if (existingUser) {
  //     existingUser.email = email || existingUser.email;
  //     existingUser.avatar_url = avatar_url || existingUser.avatar_url;
  //     existingUser.username = username || email.split('@')[0];
  //     return this.userRepo.save(existingUser);
  //   }

  //   // if user does not exist create it
  //   let finalUsername = username || email.split('@')[0];
  //   while (
  //     await this.userRepo.findOne({ where: { username: finalUsername } })
  //   ) {
  //     finalUsername += Math.floor(Math.random() * 10000);
  //   }
  //   const newUser = this.userRepo.create({
  //     id,
  //     email,
  //     username: finalUsername,
  //     avatar_url,
  //   });
  //   return this.userRepo.save(newUser);
  // }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = this.userRepo.create(createUserDto);
    return this.userRepo.save(user);
  }

  async findById(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      return null;
    }

    return user; // or omit sensitive fields if needed
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user) {
      return null;
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      return null;
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
