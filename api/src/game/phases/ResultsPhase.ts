import { GameContext } from 'src/game/classes/GameContext';
import { GamePhase } from 'src/game/classes/GamePhase';
import { Player } from 'src/game/classes/Player';
import { SERVER_SOCKET_EVENTS } from 'src/game/classes/types';

export interface ResultsOutput {
  eliminatedPlayers: Set<Player>;
  wasAnyoneEliminated: boolean;
  protectedPlayers: Set<Player>;
  gameEnded: boolean;
  winner?: 'werewolves' | 'villagers';
  round: number;
}

export abstract class ResultsPhase extends GamePhase {
  constructor(context: GameContext) {
    super(context);
  }

  protected resultsOutput: ResultsOutput = {
    eliminatedPlayers: new Set(),
    wasAnyoneEliminated: false,
    protectedPlayers: new Set(),
    gameEnded: false,
    round: this.context.round,
  };

  // Phase durations
  get prePhaseDuration(): number {
    return 3000; // 3 seconds for dawn transition
  }

  get phaseDuration(): number {
    return 10000; // 10 seconds to reveal  results
  }

  get postPhaseDuration(): number {
    return 3000; // 3 seconds before day phase
  }

  protected async onStart(): Promise<void> {
    // Process  actions in order of priority
    this.processActions();

    // Handle player eliminations (after processing protections)
    this.handlePlayerEliminations();

    // Broadcast results to appropriate players
    this.broadcastResults();
  }

  protected async onEnd(): Promise<void> {
    this.context.checkGameEndConditions();
  }

  protected async onPostPhase(): Promise<void> {}

  protected validatePlayerPermissions(): void {
    return; // No specific player permissions needed for this phase
  }

  private broadcastResults(): void {
    const eliminatedPlayers = Array.from(
      this.resultsOutput.eliminatedPlayers,
    ).map((player) => player.id);

    this.context.broadcastToPlayers(SERVER_SOCKET_EVENTS.roundResults, {
      round: this.resultsOutput.round,
      eliminatedPlayers,
      message: this.resultsOutput.wasAnyoneEliminated
        ? 'Someone was eliminated! The werewolves are closing in!'
        : 'No one was eliminated! The village is safe!',
    });
  }

  private handlePlayerEliminations(): void {
    const eliminatedPlayers = this.resultsOutput.eliminatedPlayers;
    for (const player of eliminatedPlayers) {
      player.die();
    }
  }

  abstract processActions(): void;
}
