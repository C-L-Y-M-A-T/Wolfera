import { GameContext } from 'src/game/classes/GameContext';
import { GenericVoteManager } from 'src/game/services/vote-manager/vote-manager.service';

export class VotePhaseManager extends GenericVoteManager {
  constructor(context: GameContext) {
    super(context);
  }
}
