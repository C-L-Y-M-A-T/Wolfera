import { PlayerAction } from 'src/roles';
import { ChainableGamePhase } from '../../chainablePhase';
import { Player } from '../../Player';
import { NightPhase } from '../night.phase';
import { PhaseConstructor } from './../../types';
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

  protected validatePlayerAction(
    player: Player,
    action: PlayerAction,
  ): action is PlayerAction<WaitingForGameStartPlayerAction> {
    return action.phasePayload?.action === 'start-game';
  }

  protected async processPlayerAction(
    player: Player,
    action: PlayerAction<WaitingForGameStartPlayerAction>,
  ): Promise<void> {
    this.context.tempAsignRoles();
    this.end();
  }
}
