import { GameContext } from './GameContext';
import { GamePhase } from './GamePhase';
import { PhaseOrchestrator } from './PhaseOrchestrator';

export class SequentialPhaseOrchestrator<
  TInput = any,
  TOutput = any,
> extends PhaseOrchestrator<TInput, TOutput> {
  constructor(
    context: GameContext,
    private phases: Array<{
      factory: (context: GameContext) => GamePhase;
      shouldExecute?: (context: GameContext) => boolean;
    }>,
  ) {
    super(context);
  }

  async execute(initialData?: TInput): Promise<TOutput> {
    let currentData: any = { initialData };

    for (const phaseDef of this.phases) {
      if (phaseDef.shouldExecute && !phaseDef.shouldExecute(this.context))
        continue;

      this.currentPhase = phaseDef.factory(this.context);
      currentData[this.currentPhase.phaseName] =
        await this.currentPhase.executeAsync(currentData);
    }

    this.currentPhase = undefined; // Clear after completion
    return currentData as TOutput;
  }
}
