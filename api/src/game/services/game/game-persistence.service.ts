import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Player } from 'src/game/classes/Player';
import { GameResult as GameResultType } from 'src/game/classes/types';
import { UserGameStatsDto } from 'src/game/dto/stats/user-stats.dto';
import { GameEntity, GameResult } from 'src/game/entities/game.entity';
import { PlayerGameResult } from 'src/game/entities/player-game-result.entity';
import { WEREWOLF_ROLE_NAME } from 'src/roles/werewolf';
import { BaseService } from 'src/utils/generic/base.service';

import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class GamePersistenceService extends BaseService<
  GameEntity,
  DeepPartial<GameEntity>,
  DeepPartial<GameEntity>
> {
  constructor(
    @InjectRepository(GameEntity)
    protected readonly gameRepo: Repository<GameEntity>,

    @InjectRepository(PlayerGameResult)
    private readonly playerResultRepo: Repository<PlayerGameResult>,
  ) {
    super(gameRepo);
  }

  async createGameRecord(code: string): Promise<GameEntity> {
    return this.createOne({ code });
  }

  async findByCode(code: string): Promise<GameEntity | null> {
    return await this.findOne({ code }, { withException: true });
  }

  async updatePlayerRoles(code: string, players: Player[]): Promise<void> {
    const game = await this.findByCode(code);
    const gameId = game?.id;

    await Promise.all(
      players.map((player) => {
        const playerId = player.profile?.id;
        const roleName = player.role?.roleData?.name;

        if (!playerId || !roleName) {
          throw new Error(
            `Invalid player or role: ${JSON.stringify({ playerId, roleName })}`,
          );
        }

        return this.playerResultRepo.save({
          gameId,
          playerId,
          role: roleName,
        });
      }),
    );
  }

  async recordPlayerDeath(code: string, playerId: string): Promise<void> {
    const game = await this.findByCode(code);
    const gameId = game?.id;

    await this.playerResultRepo.update(
      { gameId, playerId },
      { survived: false },
    );
  }

  async finalizeGameRecord(
    code: string,
    result: GameResult,
    endedAt: Date,
  ): Promise<GameEntity> {
    const game = await this.findByCode(code);
    const gameId = game?.id;
    return this.updateOne(
      { id: gameId },
      { result, endedAt: endedAt, wasCompleted: true },
    );
  }

  async finalizePlayerResults(
    code: string,
    players: Player[],
    result: GameResultType,
  ) {
    const game = await this.findByCode(code);
    const gameId = game?.id;
    const playersFromDb = await this.playerResultRepo.find({
      where: { gameId },
    });
    const finalUpdates = playersFromDb.map((playerResult) => {
      const role = playerResult.role;
      const isWinner =
        (role === WEREWOLF_ROLE_NAME && result.winner === 'werewolves') ||
        (role !== WEREWOLF_ROLE_NAME && result.winner === 'villagers')
          ? true
          : false;
      return { ...playerResult, isWinner };
    });

    await Promise.all(
      finalUpdates.map(({ gameId, playerId, isWinner }) => {
        console.log('Updating player result', { gameId, playerId, isWinner });
        return this.playerResultRepo.update({ gameId, playerId }, { isWinner });
      }),
    );
  }

  async getPlayerGames(playerId: string): Promise<PlayerGameResult[]> {
    return this.playerResultRepo.find({
      where: { playerId },
      relations: ['game'],
      order: { game: { endedAt: 'DESC' } },
    });
  }

  async findCompletedGames(
    playerId?: string,
    limit?: number,
  ): Promise<GameEntity[]> {
    const where: FindOptionsWhere<GameEntity> = { wasCompleted: true };
    if (playerId) {
      where.playerResults = { player: { id: playerId } };
    }
    const options = {
      where,
      relations: {
        playerResults: {
          player: true,
        },
      },
      order: { endedAt: 'DESC' as 'DESC' | 'ASC' },
    };
    if (limit) {
      options['take'] = limit;
    }
    return this.findAll(options);
  }

  async getCompletedGameDetails(gameId: string): Promise<GameEntity> {
    const game = await this.findOne(
      { id: gameId, wasCompleted: true },
      {
        withException: false,
        relations: {
          playerResults: {
            player: true,
          },
        },
      },
    );
    if (!game) {
      throw new NotFoundException(
        `Game with id ${gameId} not found or not completed`,
      );
    }
    return game;
  }

  async getCompletedGameStats(playerId: string) {
    type RawStats = {
      totalGames: string;
      gamesWon: string;
      gamesAsWerewolf: string;
      gamesAsVillager: string;
    };
    const result = await this.playerResultRepo
      .createQueryBuilder('pgr')
      .innerJoin('pgr.game', 'game')
      .where('pgr.playerId = :playerId', { playerId })
      .andWhere('game.wasCompleted = :completed', { completed: true })
      .select('COUNT(DISTINCT pgr.gameId)', 'totalGames')
      .addSelect(
        'SUM(CASE WHEN pgr.isWinner = true THEN 1 ELSE 0 END)',
        'gamesWon',
      )
      .addSelect(
        'SUM(CASE WHEN pgr.role = :werewolfRole THEN 1 ELSE 0 END)',
        'gamesAsWerewolf',
      )
      .addSelect(
        'SUM(CASE WHEN pgr.role != :werewolfRole THEN 1 ELSE 0 END)',
        'gamesAsVillager',
      )
      .setParameter('werewolfRole', WEREWOLF_ROLE_NAME)
      .getRawOne<RawStats>();
    return {
      totalGames: parseInt(result?.totalGames ?? '0'),
      gamesWon: parseInt(result?.gamesWon ?? '0'),
      gamesAsWerewolf: parseInt(result?.gamesAsWerewolf ?? '0'),
      gamesAsVillager: parseInt(result?.gamesAsVillager ?? '0'),
    };
  }

  async calculateUserStats(userId: string): Promise<UserGameStatsDto> {
    const [results, counts] = await Promise.all([
      this.playerResultRepo.find({
        where: { playerId: userId },
        relations: ['game'],
      }),
      this.getCompletedGameStats(userId),
    ]);
    const completedResults = results.filter((r) => r.game?.wasCompleted);
    const stats = {
      totalGames: counts.totalGames || 0,
      gamesWon: counts.gamesWon || 0,
      gamesAsWerewolf: counts.gamesAsWerewolf || 0,
      gamesAsVillager: counts.gamesAsVillager || 0,
      winRate: counts.totalGames
        ? (counts.gamesWon / counts.totalGames) * 100
        : 0,
      werewolfWinRate: counts.gamesAsWerewolf
        ? (completedResults.filter(
            (r) => r.role === WEREWOLF_ROLE_NAME && r.isWinner,
          ).length /
            counts.gamesAsWerewolf) *
          100
        : 0,
      villagerWinRate: counts.gamesAsVillager
        ? (completedResults.filter(
            (r) => r.role !== WEREWOLF_ROLE_NAME && r.isWinner,
          ).length /
            counts.gamesAsVillager) *
          100
        : 0,
      survivalRate: counts.totalGames
        ? (completedResults.filter((r) => r.survived).length /
            counts.totalGames) *
          100
        : 0,
    };
    return plainToInstance(UserGameStatsDto, stats);
  }
}
