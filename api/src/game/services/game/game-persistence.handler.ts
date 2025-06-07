import { Player } from 'src/game/classes/Player';
import { GameResult, PHASE_NAMES } from 'src/game/classes/types';
import { GameResult as WinningTeam } from 'src/game/entities/game.entity';
import { EventHandlerFactory } from 'src/game/events/event-emitter/decorators/event-handler.decorator';
import { events } from 'src/game/events/event.types';
import { GameContext } from '../../classes/GameContext';
import {
  GameEventHandler,
  OnGameEvent,
} from '../../events/event-emitter/decorators/game-event.decorator';

@EventHandlerFactory()
export class GamePersistenceHandler implements GameEventHandler {
  constructor(private context: GameContext) {}

  @OnGameEvent(events.GAME.CREATE)
  async onGameStart({ gameId }: { gameId: string }) {
    await this.context.persistenceService.createGameRecord(gameId);
  }

  @OnGameEvent(events.GAME.PHASE.END(PHASE_NAMES.ROLE_ASSIGNMENT))
  async onRolesAssigned() {
    console.log('role assignment fl handler');

    await this.context.persistenceService.updatePlayerRoles(
      this.context.gameId,
      this.context.getplayers(),
    );
  }

  @OnGameEvent(events.GAME.PLAYER.KILLED)
  async onPlayerEliminated(player: Player) {
    console.log('player met');
    await this.context.persistenceService.recordPlayerDeath(
      this.context.gameId,
      player.id,
    );
  }

  mapWinnerToGameResult(winner: string | null): WinningTeam {
    switch (winner) {
      case 'villagers':
        return WinningTeam.VILLAGERS_WIN;
      case 'werewolves':
        return WinningTeam.WEREWOLVES_WIN;
      default:
        return WinningTeam.ABANDONED;
    }
  }

  @OnGameEvent(events.GAME.END)
  async onGameEnd({
    results,
    endedAt,
  }: {
    results: GameResult;
    endedAt: Date;
  }) {
    console.log('lo3ba wfet');
    const result = this.mapWinnerToGameResult(results.winner);
    const endedAtDate = new Date(endedAt);
    await this.context.persistenceService.finalizePlayerResults(
      this.context.gameId,
      this.context.getplayers(),
      results,
    );
    await this.context.persistenceService.finalizeGameRecord(
      this.context.gameId,
      result,
      endedAtDate,
    );
  }
}
