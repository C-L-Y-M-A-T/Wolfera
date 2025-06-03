import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameContext } from 'src/game/classes/GameContext';
import { Player } from 'src/game/classes/Player';
import { GameEntity, GameResult } from 'src/game/entities/game.entity';
import { PlayerGameResult } from 'src/game/entities/player-game-result.entity';
import { BaseService } from 'src/utils/generic/base.service';
import { DeepPartial, Repository } from 'typeorm';

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

  async createGameRecord(context: GameContext): Promise<GameEntity> {
    return this.createOne({
      id: context.gameId,
    });
  }

  async updatePlayerRoles(gameId: string, players: Player[]): Promise<void> {
    await Promise.all(
      players.map((player) => {
        if (!player?.role) {
          throw new Error(`Player ${player.id} has no role assigned`);
        }
        return this.playerResultRepo.update(
          { gameId, playerId: player.id },
          { role: player.role.roleData.name },
        );
      }),
    );
  }

  async recordPlayerDeath(gameId: string, playerId: string): Promise<void> {
    await this.playerResultRepo.update(
      { gameId, playerId },
      { survived: false },
    );
  }

  async finalizeGameRecord(
    gameId: string,
    result: GameResult,
  ): Promise<GameEntity> {
    return this.updateOne(
      { id: gameId },
      { result, endedAt: new Date(), wasCompleted: true },
    );
  }

  async getPlayerGames(playerId: string): Promise<PlayerGameResult[]> {
    return this.playerResultRepo.find({
      where: { playerId },
      relations: ['game'],
      order: { game: { endedAt: 'DESC' } },
    });
  }

  async getGameDetails(gameId: string): Promise<GameEntity | null> {
    return this.findOne(
      { id: gameId },
      {
        relations: {
          playerResults: true,
        },
      },
    );
  }
}
