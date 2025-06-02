import { GameContext } from 'src/game/classes/GameContext';
import { GamePhase } from 'src/game/classes/GamePhase';

export class NightResultsPhase extends GamePhase {
  constructor(context: GameContext) {
    super(context);
  }

  get phaseName(): `${string}-phase` {
    return 'NightResults-phase';
  }
  get phaseDuration(): number {
    return 0; // No specific duration, ends when all actions are processed
  }
  protected async onStart(): Promise<void> {
    console.log('NightResultsPhase started');
  }
  protected async onEnd(): Promise<void> {
    console.log('NightResultsPhase ended');
  }

  protected validatePlayerPermissions(): void {
    return; // No specific player permissions needed for this phase
  }

  private calculateNightResults(): void {
    console.log(this.input);
  }
}
