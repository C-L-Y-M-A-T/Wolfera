import { ChainableGamePhase } from '../../chainablePhase';
import { Player } from '../../Player';
import { NightPhase } from '../night.phase';
import { PhaseConstructor, PlayerAction } from './../../types';
import { WaitingForGameStartPlayerAction } from './types';

export class WaitingForGameStartPhase extends ChainableGamePhase<WaitingForGameStartPlayerAction> {
  getNextPhase?(): PhaseConstructor<ChainableGamePhase> | undefined {
    return NightPhase;
  }

  readonly phaseName = 'WaitingForGameStart-phase';
  get phaseDuration(): number {
    return 0;
  }

  onStart(): void {
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

  protected async onPrePhase(): Promise<void> {
    console.log('WaitingForGameStartPhase: onPrePhase');
    this.context.gameEventEmitter.emit('game:lobby:open', {
      gameId: this.context.gameId,
    });
  }
  protected async onPostPhase(): Promise<void> {
    console.log('WaitingForGameStartPhase: onPostPhase');
    this.context.gameEventEmitter.emit('game:lobby:closed', {
      gameId: this.context.gameId,
    });
  }
  protected async onEnd(): Promise<void> {
    console.log('WaitingForGameStartPhase: onEnd');
    this.context.gameEventEmitter.emit('game:starting', {
      gameId: this.context.gameId,
      playerCount: this.context.players.size,
    });
  }

  protected validatePlayerAction(
    player: Player,
    action: PlayerAction,
  ): action is WaitingForGameStartPlayerAction {
    // Validate that the player is the game owner
    if (player.id !== this.context.owner?.id) {
      this.context.gameEventEmitter.emitToPlayer(player, 'error', {
        message: 'Only the game owner can start the game',
        code: 'NOT_OWNER',
      });
      return false;
    }

    // Validate minimum player count
    if (this.context.players.size < 2) {
      // Adjust min players as needed
      this.context.gameEventEmitter.emitToPlayer(player, 'error', {
        message: 'Not enough players to start the game',
        code: 'NOT_ENOUGH_PLAYERS',
      });
      return false;
    }

    return action.action === 'start-game';
  }

  protected async processPlayerAction(
    player: Player,
    action: WaitingForGameStartPlayerAction,
  ): Promise<void> {
    this.context.gameEventEmitter.emit('game:started', {
      startedBy: player.id,
      gameId: this.context.gameId,
      playerCount: this.context.players.size,
    });

    this.context.tempAsignRoles();
    this.end();
  }
}
