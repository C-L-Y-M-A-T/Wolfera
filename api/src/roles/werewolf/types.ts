import { Player } from 'src/game/classes/Player';
import { z } from 'zod';

export const werewolfActionSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('vote'),
    targetId: z.string(),
  }),
  z.object({
    action: z.literal('skip'),
  }),
]);

export type WerewolfActionPayload = z.infer<typeof werewolfActionSchema>;

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
  action: WerewolfActionPayload;
}
