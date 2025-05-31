import { WsException } from '@nestjs/websockets';
import { ChainableGamePhase } from '../../chainablePhase';
import { GameContext } from '../../GameContext';
import { Player } from '../../Player';
import { NightPhase } from '../night.phase';
import { PhaseConstructor, PlayerAction } from './../../types';
import {
  WaitingForGameStartPlayerAction,
  waitingForGameStartPlayerActionSchema,
} from './types';

export class WaitingForGameStartPhase extends ChainableGamePhase<WaitingForGameStartPlayerAction> {
  constructor(context: GameContext) {
    super(context, waitingForGameStartPlayerActionSchema);
  }
  getNextPhase?(): PhaseConstructor<ChainableGamePhase> | undefined {
    return NightPhase;
  }

  readonly phaseName = 'WaitingForGameStart-phase';
  get phaseDuration(): number {
    return 0;
  }

  onStart(): void {
    this.context.emmit('game:waitingForGameStart', {
      gameId: this.context.gameId,
      players: this.context.players,
    });
  }

  protected async onPrePhase(): Promise<void> {
    console.log('WaitingForGameStartPhase: onPrePhase');
  }
  protected async onPostPhase(): Promise<void> {
    console.log('WaitingForGameStartPhase: onPostPhase');
  }
  protected async onEnd(): Promise<void> {
    console.log('WaitingForGameStartPhase: onEnd');
  }

  protected async processPlayerAction(
    player: Player,
    action: PlayerAction<WaitingForGameStartPlayerAction>,
  ): Promise<void> {
    if (this.context.players.size !== this.context.gameOptions.totalPlayers) {
      throw new WsException(
        `Waiting for ${this.context.gameOptions.totalPlayers} players to join. Current players: ${this.context.players.size}.`,
      );
    }

    this.context.tempAsignRoles();
    this.end();
  }
  protected validatePlayerPermissions(
    player: Player,
    action: PlayerAction<WaitingForGameStartPlayerAction>,
  ): void {
    if (!this.context.owner || player.id !== this.context.owner.id) {
      throw new WsException(
        'Only the game owner can start the game from the waiting phase.',
      );
    }
  }
}
