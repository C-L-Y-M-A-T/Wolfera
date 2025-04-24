import { GamePhase } from '../../GamePhase';
import { Player } from '../../Player';
import { PlayerAction } from './../../types';
import { WaitingForGameStartPlayerAction } from './types';

export class WaitingForGameStartPhase extends GamePhase<WaitingForGameStartPlayerAction> {
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

  protected validateAction(action: PlayerAction): boolean {
    return action.action === 'start-game';
  }

  protected async processPlayerAction(
    player: Player,
    action: WaitingForGameStartPlayerAction,
  ): Promise<void> {
    this.context.start();
  }
}
