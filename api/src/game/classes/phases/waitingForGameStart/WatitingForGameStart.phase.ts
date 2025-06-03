/* eslint-disable @typescript-eslint/require-await */
import { WsException } from '@nestjs/websockets';
import { GameContext } from '../../GameContext';
import { Player } from '../../Player';
import { ChainableGamePhase } from '../chainablePhase';
import { RoleAssignmentPhase } from '../roleAssignmentPhase/roleAssignment.phase';
import { PHASE_NAMES, PhaseConstructor } from './../../types';
import {
  WaitingForGameStartPlayerAction,
  waitingForGameStartPlayerActionSchema,
} from './types';

export class WaitingForGameStartPhase extends ChainableGamePhase<WaitingForGameStartPlayerAction> {
  constructor(context: GameContext) {
    super(context, waitingForGameStartPlayerActionSchema);
  }
  getNextPhase?(): PhaseConstructor<ChainableGamePhase> | undefined {
    return RoleAssignmentPhase;
  }

  readonly phaseName = PHASE_NAMES.WAITING_FOR_GAME_START;
  get phaseDuration(): number {
    return 0;
  }

  onStart(): void {
    console.log('WaitingForGameStartPhase: onStart');
    this.context.gameEventEmitter.broadcastToPlayers(
      'game:waitingForGameStart',
      {
        gameId: this.context.gameId,
        players: Array.from(this.context.players.values()).map((player) => ({
          id: player.id,
          name: player.profile.id, // TODO: change to name
          isConnected: player.isConnected(),
          isOwner: this.context.owner?.id === player.id,
        })),
        owner: this.context.owner?.id,
      },
    );
  }

  protected async onEnd(): Promise<void> {
    this.context.gameEventEmitter.emit('game:starting', {
      gameId: this.context.gameId,
      playerCount: this.context.players.size,
    });
  }

  protected async processPlayerAction(player: Player): Promise<void> {
    const gameData = this.context.getPublicGameData();
    this.context.gameEventEmitter.emit('game:started', gameData);

    // Broadcast to all players that the game is starting
    this.broadcastToPlayers('game-started', gameData);

    await this.end();
  }

  protected validatePlayerPermissions(player: Player): void {
    // Validate that the player is the game owner
    if (player.id !== this.context.owner?.id) {
      this.context.gameEventEmitter.emitToPlayer(player, 'error', {
        message: 'Only the game owner can start the game',
        code: 'NOT_OWNER',
      });
      throw new WsException('Not owner');
    }

    // Validate minimum player count
    if (this.context.players.size < 2) {
      // Adjust min players as needed
      this.context.gameEventEmitter.emitToPlayer(player, 'error', {
        message: 'Not enough players to start the game',
        code: 'NOT_ENOUGH_PLAYERS',
      });
      throw new WsException('Low size');
    }
  }
}
