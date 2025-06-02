import { Player } from 'src/game/classes/Player';
import { PlayerAction } from 'src/game/classes/types';

export type WerewolfAction = PlayerAction & {
  action: 'werewolf-vote' | 'werewolf-skip';
  targetId?: string;
};

export type WerewolfVoteAction = WerewolfAction & {
  action: 'werewolf-vote';
  targetId: string;
};

export type WerewolfSkipAction = WerewolfAction & {
  action: 'werewolf-skip';
};

// Vote tracking for werewolf consensus
export interface WerewolfVote {
  voterId: string;
  targetId: string;
  timestamp: number;
}

export interface WerewolfVoteState {
  votes: Map<string, WerewolfVote>; // voterId -> vote
  targetVoteCounts: Map<string, number>; // targetId -> count
  hasConsensus: boolean;
  consensusTarget?: Player;
  skipVotes: Set<string>; // Players who voted to skip
}

export interface WerewolfNightEndPayload {
  phase: 'Werewolf-phase';
  result: {
    action: 'kill' | 'skip';
    target?: Player;
  };
  votes: WerewolfVoteState;
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
  action: WerewolfAction;
}
