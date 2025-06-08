import { Player } from 'src/game/classes/Player';
import {
  Vote,
  VoteActionPayload,
  VoteState,
  voteActionSchema,
} from 'src/game/types/vote-manager.types';

// Keep your existing types for backward compatibility
export {
  VoteActionPayload as WerewolfActionPayload,
  Vote as WerewolfVote,
  VoteState as WerewolfVoteState,
  voteActionSchema as werewolfActionSchema,
};

export interface WerewolfNightEndPayload {
  phase: 'Werewolf-phase';
  result: {
    action: 'kill' | 'skip';
    target?: Player;
  };
  votes: VoteState;
}

export interface WerewolfErrorPayload {
  phase: 'Werewolf-phase';
  playerId: string;
  error: {
    code:
      | 'PLAYER_NOT_WEREWOLF'
      | 'INVALID_TARGET'
      | 'TARGET_NOT_ALIVE'
      | 'TARGET_IS_WEREWOLF'
      | 'PHASE_NOT_ACTIVE'
      | 'ALREADY_VOTED'
      | 'TARGET_NOT_FOUND';
    message: string;
  };
  action: VoteActionPayload;
}
