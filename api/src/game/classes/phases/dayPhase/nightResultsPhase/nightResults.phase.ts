import { GameContext } from 'src/game/classes/GameContext';
import { GamePhase } from 'src/game/classes/GamePhase';
import { Player } from 'src/game/classes/Player';
import { phaseNames, serverSocketEvent } from 'src/game/classes/types';
import { WEREWOLF_ROLE_NAME } from 'src/roles/werewolf';
import { WerewolfNightEndPayload } from 'src/roles/werewolf/types';
import { WITCH_ROLE_NAME } from 'src/roles/witch';
import { WitchNightEndPayload } from 'src/roles/witch/types';

interface NightResultsOutput {
  eliminatedPlayers: Set<Player>;
  wasAnyoneEliminated: boolean;
  protectedPlayers: Set<Player>;
  gameEnded: boolean;
  winner?: 'werewolves' | 'villagers';
  round: number;
}

export class NightResultsPhase extends GamePhase {
  constructor(context: GameContext) {
    super(context);
  }

  private nightResultsOutput: NightResultsOutput = {
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
    this.processNightActions();

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
      this.nightResultsOutput.eliminatedPlayers,
    ).map((player) => player.id);

    this.broadcastToPlayers(serverSocketEvent.roundResults, {
      round: this.nightResultsOutput,
      eliminatedPlayers,
      message: this.nightResultsOutput.wasAnyoneEliminated
        ? 'Someone was eliminated! The werewolves are closing in!'
        : 'No one was eliminated! The village is safe!',
    });
  }

  private handlePlayerEliminations(): void {
    const eliminatedPlayers = this.nightResultsOutput.eliminatedPlayers;
    for (const player of eliminatedPlayers) {
      player.die();
    }
  }

  private processNightActions(): void {
    this.processWerewolvesActions();
    this.processSeerInvestigations();
    this.processWitchActions();
  }

  private processSeerInvestigations(): void {
    // TODO: process seer investigations
  }

  private processWerewolvesActions(): void {
    // TODO: process night actions
    const werewolvesResults = this.input[
      phaseNames.ROLES(WEREWOLF_ROLE_NAME)
    ] as WerewolfNightEndPayload | undefined;

    if (werewolvesResults) {
      if (werewolvesResults.result.action === 'kill') {
        const target = werewolvesResults.result.target;
        if (target) {
          const witchResults = this.input[phaseNames.ROLES(WITCH_ROLE_NAME)] as
            | WitchNightEndPayload
            | undefined;
          if (witchResults) {
            if (witchResults.result.action === 'save') {
              this.nightResultsOutput.protectedPlayers.add(target);
              this.nightResultsOutput.eliminatedPlayers.delete(target);
            } else {
              this.nightResultsOutput.eliminatedPlayers.add(target);
              this.nightResultsOutput.wasAnyoneEliminated = true;
            }
          }
        }
      }
    }
  }

  processWitchActions(): void {
    const witchResults = this.input[phaseNames.ROLES(WITCH_ROLE_NAME)] as
      | WitchNightEndPayload
      | undefined;
    if (witchResults) {
      if (witchResults.result.action === 'kill') {
        const target = witchResults.result.target;
        if (target) {
          this.nightResultsOutput.eliminatedPlayers.add(target);
          this.nightResultsOutput.wasAnyoneEliminated = true;
        }
      }
    }
  }
}
