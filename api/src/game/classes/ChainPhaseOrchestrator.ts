import { ChainableGamePhase } from './chainablePhase';
import { GameContext } from './GameContext';
import { PhaseOrchestrator } from './PhaseOrchestrator';
import { PhaseConstructor } from './types';

//TODO: this class and ChainablePhase are not tested
export class ChainPhaseOrchestrator<
  TInput = any,
  TOutput = any,
> extends PhaseOrchestrator<TInput, TOutput> {
  declare protected currentPhase?: ChainableGamePhase;
  private phaseHistory: ChainableGamePhase[] = [];

  constructor(
    context: GameContext,
    private initialPhase: PhaseConstructor<ChainableGamePhase>,
  ) {
    super(context);
  }

  async execute(initialData?: TInput): Promise<TOutput> {
    let PhaseConstructor: PhaseConstructor<ChainableGamePhase> | undefined =
      this.initialPhase;
    const currentData = { initialData };

    while (PhaseConstructor) {
      this.context.gameEventEmitter.emit('phase:transition', {
        nextPhase: PhaseConstructor.name,
        phaseNumber: this.phaseHistory.length + 1,
        gameId: this.context.gameId,
      });

      // Instantiate and execute current phase
      this.currentPhase = new PhaseConstructor(this.context);
      this.phaseHistory.push(this.currentPhase);

      currentData[this.currentPhase.phaseName] =
        await this.currentPhase.executeAsync(currentData);

      // Determine next phase
      PhaseConstructor = this.currentPhase.getNextPhase?.();
    }

    this.currentPhase = undefined;
    return currentData as TOutput;
  }

  getPhaseHistory(): readonly ChainableGamePhase[] {
    return this.phaseHistory;
  }
}
