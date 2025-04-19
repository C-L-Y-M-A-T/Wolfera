import { GamePhase } from '../GamePhase';

export class WaitingForGameStartPhase extends GamePhase {
  readonly phaseName = 'WaitingForGameStart';
  get phaseDuration(): number {
    return 10000;
  }

  onStart(): void {
    this.context.emmit('game:waitingForGameStart', {
      gameId: this.context.gameId,
      players: this.context.players,
    });
  }

  protected async onPrePhase(): Promise<void> {
    this.context.emmit('game:waitingForGameStart:pre', undefined);
  }
  protected async onPostPhase(): Promise<void> {
    this.context.emmit('game:waitingForGameStart:post', undefined);
  }
  protected async onEnd(): Promise<void> {
    this.context.emmit('game:waitingForGameStart:end', undefined);
  }
}
