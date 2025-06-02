import { RoleName } from 'src/roles';
import { z } from 'zod';
import { GameContext } from './GameContext';
import { GamePhase } from './GamePhase';
import { ChainableGamePhase } from './chainablePhase';

export enum PhaseState {
  Pending = 'pending',
  Pre = 'pre',
  Active = 'active',
  Post = 'post',
  Completed = 'completed',
}

//TODO: to think about the options we want to add
export type GameOptions = {
  roles: Partial<Record<RoleName, number>>;
  totalPlayers: number;
};

export type PhaseConstructor<T extends ChainableGamePhase = GamePhase> = new (
  context: GameContext,
) => T;

export type PhaseName = `${string}-phase`;

export type PlayerAction<ActionPayload = any> = {
  activePhase: string;
  timestamp: number;
  phasePayload: ActionPayload;
};

export const PlayerActionSchema = z.object({
  activePhase: z.string(),
  timestamp: z.number(),
  phasePayload: z.any(),
});

/**
 * Game events that can be emitted during gameplay
 */ /*
export const GameEvent = {
  phaseStart: 'phase:start',
  phaseEnd: 'phase:end',
  playerAction: 'player:action',
  playerEliminated: 'player:eliminated',
  playerJoined: 'player:join',
  playerLeft: 'player:leave',
  gameStart: 'game:start',
  gameEnd: 'game:end',
  nightStart: 'night:start',
  nightEnd: 'night:end',
  dayStart: 'day:start',
  dayEnd: 'day:end',
  voteStart: 'vote:start',
  voteEnd: 'vote:end',
  roleAction: 'role:action',
  roleAssigned: 'role:assigned',
};*/

export const serverSocketEvent = {
  gameEvent: 'game-event',
  roleAssigned: 'role-assigned',
  playerEliminated: 'player-eliminated',
  playerJoined: 'player-joined',
  playerLeft: 'player-left',
  gameStarted: 'game-started',
  phaseStarted: 'phase-started',
  phaseEnded: 'phase-ended',
  roleRevealed: 'role-revealed',
};

// Payload types for each serverSocketEvent
export type ServerSocketEventPayloads = {
  //[serverSocketEvent.gameEvent]: { event: keyof typeof GameEvent; data: any };
  [serverSocketEvent.roleAssigned]: { playerId: string; role: RoleName };
  [serverSocketEvent.playerEliminated]: { playerId: string };
  [serverSocketEvent.playerJoined]: { playerId: string; playerName: string };
  [serverSocketEvent.playerLeft]: { playerId: string };
  [serverSocketEvent.gameStarted]: { gameId: string; options: GameOptions };
  [serverSocketEvent.phaseStarted]: { phase: string; state: PhaseState };
  [serverSocketEvent.phaseEnded]: { phase: string; state: PhaseState };
  [serverSocketEvent.roleRevealed]: { playerId: string; role: RoleName }; //
};
