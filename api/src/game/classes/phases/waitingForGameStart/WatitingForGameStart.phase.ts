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

  onStart(): void {}

  protected async onPrePhase(): Promise<void> {
    console.log('WaitingForGameStartPhase: onPrePhase');
  }
  protected async onPostPhase(): Promise<void> {
    console.log('WaitingForGameStartPhase: onPostPhase');
  }
  protected async onEnd(): Promise<void> {
    console.log('WaitingForGameStartPhase: onEnd');
  }

  protected validateAction(action: PlayerAction): boolean {
    return action.action === 'start-game';
  }

  protected async processPlayerAction(
    player: Player,
    action: WaitingForGameStartPlayerAction,
  ): Promise<void> {
    this.context.tempAsignRoles();
    this.end();
  }
}
