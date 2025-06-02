import { GameContext } from 'src/game/classes/GameContext';
import { GamePhase } from 'src/game/classes/GamePhase';

export class NightResultsPhase extends GamePhase {
  constructor(context: GameContext) {
    super(context);
  }

  // Phase durations
  get prePhaseDuration(): number {
    return 3000; // 3 seconds for dawn transition
  }

  get phaseDuration(): number {
    return 10000; // 10 seconds to reveal night results
  }

  get postPhaseDuration(): number {
    return 3000; // 3 seconds before day phase
  }

  get phaseName(): `${string}-phase` {
    return 'NightResults-phase';
  }

  protected async onStart(): Promise<void> {
    // Process night actions in order of priority
    await this.processNightActions();

    // Handle player eliminations (after processing protections)
    await this.handlePlayerEliminations();

    // Process seer investigations
    this.processSeerInvestigations();

    // Check for game end conditions
    this.checkGameEndConditions();

    // Broadcast results to appropriate players
    await this.broadcastResults();
  }

  protected async onEnd(): Promise<void> {
    if (this.nightResultsOutput.gameEnded) {
      this.broadcastToPlayers('game:end', {
        winner: this.nightResultsOutput.winner,
        message: this.getGameEndMessage(),
      });
    } else {
      this.broadcastToPlayers('phase:end', {
        phase: this.phaseName,
        message: 'Night results concluded. The village awakens for a new day.',
      });
    }
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
