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
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findOne(
      {
        email: createUserDto.email,
      },
      { withException: false },
    );
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.createOne(createUserDto);
    return user;
  }

  async findById(id: string) {
    const user = await this.findOne({ id }, { withException: false });
    return user; // or omit sensitive fields if needed
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.findOne({ username }, { withException: false });
    if (!user) {
      return null;
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.findOne({ email }, { withException: false });
    if (!user) {
      return null;
    }
    return user;
  }

  findAll(): Promise<User[]> {
    return this.findAll();
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
    return this.updateOne({ id: user.id }, user);
  }
}
