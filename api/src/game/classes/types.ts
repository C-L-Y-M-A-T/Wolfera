import { RoleName } from 'src/roles';
import { WerewolfVote } from 'src/roles/werewolf/types';
import { z } from 'zod';
import { ChainableGamePhase } from '../phases/chainablePhase';
import { GameContext } from './GameContext';
import { GamePhase } from './GamePhase';

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

export type GameResult = {
  winner: 'werewolves' | 'villagers' | null;
  message: string;
};

export const PlayerActionSchema = z.object({
  activePhase: z.string(),
  timestamp: z.number(),
  phasePayload: z.any(),
});

export const SERVER_SOCKET_EVENTS = {
  gameEvent: 'game-event',
  roleAssigned: 'role-assigned',
  playerEliminated: 'player-eliminated',
  playerJoined: 'player-join',
  playerLeft: 'player-left',
  gameStarted: 'game-started',
  phaseStarted: 'phase-start',
  phaseEnded: 'phase-ended',
  roleRevealed: 'role-revealed',
  gameEnded: 'game-ended',
  roundResults: 'round-results',
  werewolfVote: 'werewolf-vote',
} as const;

// Payload types for each serverSocketEvent
export type ServerSocketEventPayloads = {
  //[serverSocketEvent.gameEvent]: { event: keyof typeof GameEvent; data: any };
  [SERVER_SOCKET_EVENTS.roleAssigned]: { role: RoleName };
  [SERVER_SOCKET_EVENTS.playerEliminated]: { playerId: string };
  [SERVER_SOCKET_EVENTS.playerJoined]: { playerId: string; playerName: string };
  [SERVER_SOCKET_EVENTS.playerLeft]: { playerId: string };
  [SERVER_SOCKET_EVENTS.gameStarted]: any;
  [SERVER_SOCKET_EVENTS.phaseStarted]: {
    phaseName: string;
    startTime: number;
    phaseDuration;
    payload?: any; // Optional payload for the phase
    round: number;
  };
  [SERVER_SOCKET_EVENTS.phaseEnded]: { phaseName: string; round: number };
  [SERVER_SOCKET_EVENTS.roleRevealed]: { playerId: string; role: RoleName }; //
  [SERVER_SOCKET_EVENTS.gameEnded]: GameResult;
  [SERVER_SOCKET_EVENTS.roundResults]: {
    round: number;
    eliminatedPlayers: string[];
    message: string;
  };
  [SERVER_SOCKET_EVENTS.werewolfVote]: WerewolfVote[];
};
export type ServerSocketEvent = keyof ServerSocketEventPayloads;

export const PHASE_NAMES = {
  ROLE: (role: RoleName) => `${role}-phase` as const,
  NIGHT: 'Night-phase',
  DAY_PHASES: {
    NIGHT_RESULTS: `NightResults-phase`,
    DAY_RESULTS: `DayResults-phase`,
    VOTE: 'Vote-phase',
  },
  DAY: 'Day-phase',
  ROLE_ASSIGNMENT: 'RoleAssignment-phase',
  WAITING_FOR_GAME_START: 'WaitingForGameStart-phase',
} as const;
