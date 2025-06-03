import { Player } from 'src/game/classes/Player';
import { z } from 'zod';

export const voteActionSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('vote'),
    targetId: z.string(),
  }),
  z.object({
    action: z.literal('skip'),
  }),
]);

export type VoteActionPayload = z.infer<typeof voteActionSchema>;

// Generic vote tracking
export interface Vote {
  voterId: string;
  targetId: string;
  timestamp: number;
}

export interface VoteState {
  votes: Map<string, Vote>; // voterId -> vote
  targetVoteCounts: Map<string, number>; // targetId -> count
  hasConsensus: boolean;
  consensusTarget?: Player;
  skipVotes: Set<string>; // Players who voted to skip
}

// Configuration for different voting phases
export interface VotePhaseConfig {
  phaseName: string;
}

export interface VoteResult {
  action: 'kill' | 'skip';
  target?: Player;
  cancelled?: boolean;
}

export interface VoteEndPayload {
  phase: string;
  result: VoteResult;
  votes: VoteState;
}

export interface VoteErrorPayload {
  phase: string;
  playerId: string;
  error: {
    code:
      | 'PLAYER_CANNOT_VOTE'
      | 'INVALID_TARGET'
      | 'TARGET_NOT_ALIVE'
      | 'TARGET_NOT_ELIGIBLE'
      | 'PHASE_NOT_ACTIVE'
      | 'ALREADY_VOTED'
      | 'TARGET_NOT_FOUND'
      | 'CUSTOM_VALIDATION_ERROR';
    message: string;
  };
  action: VoteActionPayload;
}
