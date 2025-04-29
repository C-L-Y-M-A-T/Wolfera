import { ChainableGamePhase } from './chainablePhase';
import { GameContext } from './GameContext';
import { PhaseOrchestrator } from './PhaseOrchestrator';

//TODO: this class and ChainablePhase are not tested
export class ChainPhaseOrchestrator<
  TInput = any,
  TOutput = any,
> extends PhaseOrchestrator<TInput, TOutput> {
  declare protected currentPhase?: ChainableGamePhase;
  private phaseHistory: ChainableGamePhase[] = [];

  constructor(
    context: GameContext,
    private initialPhase: new (context: GameContext) => ChainableGamePhase,
  ) {
    super(context);
  }

  async execute(initialData?: TInput): Promise<TOutput> {
    let PhaseConstructor:
      | (new (context: GameContext) => ChainableGamePhase)
      | undefined = ({} = this.initialPhase);
    let currentData = { initialData };

    while (PhaseConstructor) {
      // Instantiate and execute current phase
      this.currentPhase = new PhaseConstructor(this.context);
      this.phaseHistory.push(this.currentPhase);

      currentData[this.currentPhase.phaseName] =
        await this.currentPhase.executeAsync(currentData);

      // Determine next phase
      const next = this.currentPhase.getNextPhase?.();
      PhaseConstructor = next?.phase;
    }

    this.currentPhase = undefined;
    return currentData as TOutput;
  }

  getPhaseHistory(): readonly ChainableGamePhase[] {
    return this.phaseHistory;
  }
}
