import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserGameStatsDto } from 'src/game/dto/stats/user-stats.dto';
import { GamePersistenceService } from 'src/game/services/game/game-persistence.service';
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
    private readonly gamePersistence: GamePersistenceService,
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

  //to be called after a game ends + don't forget to send notification with the badge
  async awardBadgesAfterGame(gameId: string): Promise<void> {
    const game = await this.gamePersistence.getCompletedGameDetails(gameId);
    if (!game) return;

    for (const playerResult of game.playerResults) {
      const stats = await this.gamePersistence.calculateUserStats(
        playerResult.playerId,
      );
      await this.updateUserBadges(playerResult.playerId, stats);
    }
  }

  private async updateUserBadges(
    userId: string,
    stats: UserGameStatsDto,
  ): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      return;
    }
    const currentBadges = [...user.badges];
    const newBadges = [...currentBadges];

    if (stats.gamesWon >= 1 && !currentBadges.includes(Badge.FIRST_WIN)) {
      newBadges.push(Badge.FIRST_WIN);
    }
    if (
      stats.gamesAsWerewolf >= 1 &&
      !currentBadges.includes(Badge.WEREWOLF_WIN)
    ) {
      newBadges.push(Badge.WEREWOLF_WIN);
    }
    if (
      stats.gamesWon - stats.gamesAsWerewolf >= 1 &&
      !currentBadges.includes(Badge.VILLAGE_HERO)
    ) {
      newBadges.push(Badge.VILLAGE_HERO);
    }
    if (stats.totalGames >= 5 && !currentBadges.includes(Badge.MOON_SURVIVOR)) {
      newBadges.push(Badge.MOON_SURVIVOR);
    }
    if (newBadges.length > currentBadges.length) {
      await this.updateOne({ id: userId }, { badges: [...new Set(newBadges)] });
    }
  }
}
