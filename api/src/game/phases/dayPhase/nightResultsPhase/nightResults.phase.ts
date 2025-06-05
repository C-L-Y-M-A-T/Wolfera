import { GameContext } from 'src/game/classes/GameContext';
import { PHASE_NAMES } from 'src/game/classes/types';
import { ResultsPhase } from 'src/game/phases/ResultsPhase';
import { WEREWOLF_ROLE_NAME } from 'src/roles/werewolf';
import { WerewolfNightEndPayload } from 'src/roles/werewolf/types';
import { WITCH_ROLE_NAME } from 'src/roles/witch';
import { WitchNightEndPayload } from 'src/roles/witch/types';

export class NightResultsPhase extends ResultsPhase {
  constructor(context: GameContext) {
    super(context);
  }

  get phaseName(): `${string}-phase` {
    return 'NightResults-phase';
  }

  processActions(): void {
    this.processWerewolvesActions();
    this.processSeerInvestigations();
    this.processWitchActions();
  }

  private processSeerInvestigations(): void {
    // TODO: process seer investigations
  }

  private processWerewolvesActions(): void {
    // TODO: process night actions
    const werewolvesResults = this.input.initialData[PHASE_NAMES.NIGHT][
      PHASE_NAMES.ROLE(WEREWOLF_ROLE_NAME)
    ] as WerewolfNightEndPayload | undefined;

    if (!werewolvesResults) return;

    if (werewolvesResults.result.action !== 'kill') return;

    const target = werewolvesResults.result.target;
    if (!target) return;

    const witchResults = this.input.initialData[PHASE_NAMES.NIGHT][
      PHASE_NAMES.ROLE(WITCH_ROLE_NAME)
    ] as WitchNightEndPayload | undefined;
    if (witchResults && witchResults.result.action === 'save') {
      this.resultsOutput.protectedPlayers.add(target);
      this.resultsOutput.eliminatedPlayers.delete(target);
    } else {
      this.resultsOutput.eliminatedPlayers.add(target);
      this.resultsOutput.wasAnyoneEliminated = true;
    }
  }

  processWitchActions(): void {
    const witchResults = this.input.initialData[PHASE_NAMES.NIGHT][
      PHASE_NAMES.ROLE(WITCH_ROLE_NAME)
    ] as WitchNightEndPayload | undefined;
    if (witchResults) {
      if (witchResults.result.action === 'kill') {
        const target = witchResults.result.target;
        if (target) {
          this.resultsOutput.eliminatedPlayers.add(target);
          this.resultsOutput.wasAnyoneEliminated = true;
        }
      }
    }
  }
}
