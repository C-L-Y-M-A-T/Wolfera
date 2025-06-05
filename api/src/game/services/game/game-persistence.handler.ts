import { Player } from 'src/game/classes/Player';
import { PHASE_NAMES } from 'src/game/classes/types';
import { GameResult } from 'src/game/entities/game.entity';
import { events } from 'src/game/events/event.types';
import { RoleAssignmentPhase } from 'src/game/phases/roleAssignmentPhase/roleAssignment.phase';
import { GameContext } from '../../classes/GameContext';
import { OnGameEvent } from '../../events/event-emitter/decorators/game-event.decorator';

export class GamePersistenceHandler {
  constructor(private context: GameContext) {}

  @OnGameEvent(events.GAME.CREATE)
  async onGameStart(context: GameContext) {
    await this.context.persistenceService.createGameRecord(context);
  }

  @OnGameEvent(events.GAME.PHASE.END(PHASE_NAMES.ROLE_ASSIGNMENT))
  async onRolesAssigned(roleAssignmentPhase: RoleAssignmentPhase) {
    await this.context.persistenceService.updatePlayerRoles(
      this.context.gameId,
      this.context.getAlivePlayers(),
    );
  }

  @OnGameEvent(events.GAME.PLAYER.KILLED)
  async onPlayerEliminated(player: Player) {
    //TODO: check type of payload
    await this.context.persistenceService.recordPlayerDeath(
      this.context.gameId,
      player.id,
    );
  }

  @OnGameEvent('game:end')
  async onGameEnd({ winner }: { winner: string }) {
    const gameResult = this.parseGameResult(winner);
    await this.context.persistenceService.finalizeGameRecord(
      this.context.gameId,
      gameResult,
    );
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
