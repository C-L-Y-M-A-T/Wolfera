import { Injectable } from '@nestjs/common';
import { GameResult } from 'src/game/entities/game.entity';
import { GameContext } from '../../classes/GameContext';
import { OnGameEvent } from '../../events/event-emitter/decorators/game-event.decorator';
import { GamePersistenceService } from './game-persistence.service';

@Injectable()
export class GamePersistenceHandler {
  constructor(private persistence: GamePersistenceService) {}

  @OnGameEvent('game:start')
  async onGameStart(context: GameContext) {
    await this.persistence.createGameRecord(context);
  }

  @OnGameEvent('roles:assigned')
  async onRolesAssigned(context: GameContext) {
    await this.persistence.updatePlayerRoles(
      context.gameId,
      context.getAlivePlayers(),
    );
  }

  @OnGameEvent('player:eliminated')
  async onPlayerEliminated(context: GameContext, playerId: string) {
    await this.persistence.recordPlayerDeath(context.gameId, playerId);
  }

  @OnGameEvent('game:end')
  async onGameEnd(context: GameContext, { winner }: { winner: string }) {
    const gameResult = this.parseGameResult(winner);
    await this.persistence.finalizeGameRecord(context.gameId, gameResult);
  }

  private parseGameResult(winner: string): GameResult {
    switch (winner) {
      case 'villagers_win':
        return GameResult.VILLAGERS_WIN;
      case 'werewolves_win':
        return GameResult.WEREWOLVES_WIN;
      default:
        throw new Error(`Invalid game result: ${winner}`);
    }
  }
}
