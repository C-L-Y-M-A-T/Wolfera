import { Player } from 'src/game/classes/Player';
import { VoteState } from 'src/game/types/vote-manager.types';

export interface VotingPhaseEndPayload {
  phase: 'Voting-phase';
  result: {
    action: 'kill' | 'skip';
    target?: Player;
  };
  votes: VoteState;
}
