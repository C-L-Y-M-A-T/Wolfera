import { GameEventHandler } from './../../events/event-emitter/decorators/game-event.decorator';
import { Injectable } from '@nestjs/common';
import { GameResult } from 'src/game/entities/game.entity';
import { EventHandlerFactory } from 'src/game/events/event-emitter/decorators/event-handler.decorator';
import { events } from 'src/game/events/event.types';
import { GameContext } from '../../classes/GameContext';
import { OnGameEvent } from '../../events/event-emitter/decorators/game-event.decorator';
import { GamePersistenceService } from './game-persistence.service';

export class GamePersistenceHandler {
  constructor(private context: GameContext) {}

  @OnGameEvent(events.GAME.CREATE)
  async onGameStart(context: GameContext) {
    await this.context.persistenceService.createGameRecord(context);
  }

  @OnGameEvent('roles:assigned')
  async onRolesAssigned() {
    await this.context.persistenceService.updatePlayerRoles(
      this.context.gameId,
      this.context.getAlivePlayers(),
    );
  }

  @OnGameEvent('player:eliminated')
  async onPlayerEliminated(payload: any) {
    //TODO: check type of payload
    await this.context.persistenceService.recordPlayerDeath(
      this.context.gameId,
      payload.playerId,
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
