import { NotFoundException } from '@nestjs/common';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { GraphQLError } from 'graphql';
import { UsersService } from 'src/users/user.service';
import { GameHistoryDto } from '../dto/stats/game-history.dto';
import { GameEntity } from '../entities/game.entity';
import { PlayerGameResult } from '../entities/player-game-result.entity';
import { GamePersistenceService } from '../services/game/game-persistence.service';

@Resolver(() => GameEntity)
export class GameResolver {
  constructor(
    private gamesService: GamePersistenceService,
    private userService: UsersService,
  ) {}

  @Query(() => [GameHistoryDto], { name: 'completedGames' })
  async getCompletedGames(
    @Args('playerId', { nullable: true }) playerId?: string,
    @Args('limit', { nullable: true }) limit?: number,
  ): Promise<GameHistoryDto[]> {
    try {
      if (playerId) {
        const user = await this.userService.findById(playerId);
        if (!user) {
          throw new GraphQLError('User Not Found', {
            extensions: {
              code: 'NOT_FOUND',
            },
          });
        }
      }
      const games = await this.gamesService.findCompletedGames(playerId, limit);

      return games.map((game) => plainToInstance(GameHistoryDto, game));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'NOT_FOUND',
            status: error.getStatus(),
          },
        });
      }
      throw error;
    }
  }

  @Query(() => GameHistoryDto, { name: 'completedGameDetails' })
  async getCompletedGameDetails(
    @Args('gameId') gameId: string,
  ): Promise<GameHistoryDto> {
    try {
      const game = await this.gamesService.getCompletedGameDetails(gameId);

      const dto = plainToInstance(GameHistoryDto, game);

      dto.playerResults = game.playerResults || [];

      return dto;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLError(`Completed game with ID ${gameId} not found`, {
          extensions: {
            code: 'NOT_FOUND',
            status: error.getStatus(),
          },
        });
      }
      throw error;
    }
  }

  @ResolveField('playerResults', () => [PlayerGameResult])
  getPlayerResults(@Parent() game: GameEntity) {
    return game.playerResults || [];
  }
}
