import { GameContext } from 'src/game/classes/GameContext';
import { GamePhase } from 'src/game/classes/GamePhase';

export class DayResultsPhase extends GamePhase {
  constructor(context: GameContext) {
    super(context);
  }

  get phaseName(): `${string}-phase` {
    return 'DayResults-phase';
  }
  get phaseDuration(): number {
    return 4; // No specific duration, ends when all actions are processed
  }
  protected async onStart(): Promise<void> {
    console.log('DayResultsPhase started');
  }
  protected async onEnd(): Promise<void> {
    console.log('DayResultsPhase ended');
  }

  protected validatePlayerPermissions(): void {
    return; // No specific player permissions needed for this phase
  }
}
