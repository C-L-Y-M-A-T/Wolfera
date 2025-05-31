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
    this.context.tempAsignRoles();
    this.end();
  }
  protected validatePlayerPermissions(
    player: Player,
    action: PlayerAction<WaitingForGameStartPlayerAction>,
  ): void {
    return;
  }
}
