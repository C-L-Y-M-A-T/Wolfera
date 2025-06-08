import { GameContext } from 'src/game/classes/GameContext';
import { PHASE_NAMES } from 'src/game/classes/types';
import { VoteEndPayload } from 'src/game/types/vote-manager.types';
import { ResultsPhase } from '../../ResultsPhase';

export class DayResultsPhase extends ResultsPhase {
  constructor(context: GameContext) {
    super(context);
  }

  get phaseName(): `${string}-phase` {
    return 'DayResults-phase';
  }
  readonly phaseDisplayName = 'Day Results';

  processActions(): void {
    const voteResults = this.input[PHASE_NAMES.DAY_PHASES.VOTE] as
      | VoteEndPayload
      | undefined;
    console.log('---------VOTE RESULTS-----------', voteResults);
    if (!voteResults) return;
    if (voteResults.result.action !== 'kill') return;
    const target = voteResults.result.target;
    if (!target) return;
    this.resultsOutput.eliminatedPlayers.add(target);
    this.resultsOutput.wasAnyoneEliminated = true;
  }
}
