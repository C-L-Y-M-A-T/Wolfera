import { GameContext } from '../../classes/GameContext';
import { GamePhase } from '../../classes/GamePhase';
import { Player } from '../../classes/Player';
import { PlayerAction } from '../../classes/types';

export abstract class PhaseOrchestrator<TInput = any, TOutput = any> {
  protected currentPhase?: GamePhase;

  constructor(protected context: GameContext) {}

  /**
   * Execute the phases according to the orchestrator's logic
   * @param initialData Initial input data
   * @returns Promise with final output
   */
  abstract execute(initialData?: TInput): Promise<TOutput>;

  /**
   * Handle player action in the current phase
   */
  async handlePlayerAction(
    player: Player,
    action: PlayerAction,
  ): Promise<void> {
    if (!this.currentPhase) {
      throw new Error('No active phase to handle player action');
    }
    await this.currentPhase.handlePlayerAction(player, action);
  }

  /**
   * Get the current active phase (if any)
   */
  getCurrentPhase(): GamePhase | undefined {
    return this.currentPhase;
  }
}
