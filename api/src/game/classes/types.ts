import { RoleName } from 'src/roles';
import { WerewolfVote } from 'src/roles/werewolf/types';
import { z } from 'zod';
import { ChainableGamePhase } from '../phases/chainablePhase';
import { Vote } from '../types/vote-manager.types';
import { GameContext } from './GameContext';
import { GamePhase } from './GamePhase';

import { DeepDTO } from 'src/utils/serializable';
import { ChannelStatus, OutgoingMessage } from '../chat/chat.types';
import { Player } from './Player';

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
  gameData: 'game-data',
  roleAssigned: 'role-assigned',
  playerEliminated: 'player-eliminated',
  playerJoin: 'player-join',
  playerConnect: 'player-connect',
  playerDisconnect: 'player-disconnect',
  playerLeft: 'player-left',
  gameStart: 'game-start',
  phaseStart: 'phase-start',
  phaseEnd: 'phase-ended',
  roleReveal: 'role-revealed',
  gameEnd: 'game-ended',
  roundResults: 'round-results',
  werewolfVote: 'werewolf-vote',
  playerVote: 'player-vote',
  channelStatus: 'channel-status',
  chatMessage: 'chat-message',
} as const;

// Payload types for each serverSocketEvent
export type ServerSocketEventPayloads = {
  //[serverSocketEvent.gameEvent]: { event: keyof typeof GameEvent; data: any };
  [SERVER_SOCKET_EVENTS.gameData]: DeepDTO<GameContext>; // Use DeepDTO to ensure all nested properties are serialized
  [SERVER_SOCKET_EVENTS.roleAssigned]: { role: RoleName };
  [SERVER_SOCKET_EVENTS.playerEliminated]: { playerId: string };
  [SERVER_SOCKET_EVENTS.playerJoin]: DeepDTO<Player>; // Use DeepDTO to ensure all nested properties are serialized
  [SERVER_SOCKET_EVENTS.playerConnect]: DeepDTO<Player>; // Use DeepDTO to ensure all nested properties are serialized
  [SERVER_SOCKET_EVENTS.playerDisconnect]: DeepDTO<Player>; // Use DeepDTO to ensure all nested properties are serialized
  [SERVER_SOCKET_EVENTS.playerLeft]: { playerId: string };
  [SERVER_SOCKET_EVENTS.gameStart]: any;
  [SERVER_SOCKET_EVENTS.phaseStart]: {
    phaseName: string;
    startTime: number;
    phaseDuration: number;
    payload?: GameDataDTO; // Optional payload for the phase
    round: number;
  };
  [SERVER_SOCKET_EVENTS.phaseEnd]: { phaseName: string; round: number };
  [SERVER_SOCKET_EVENTS.roleReveal]: { playerId: string; role: RoleName }; //
  [SERVER_SOCKET_EVENTS.gameEnd]: GameResult;
  [SERVER_SOCKET_EVENTS.roundResults]: {
    round: number;
    eliminatedPlayers: string[];
    message: string;
  };
  [SERVER_SOCKET_EVENTS.werewolfVote]: WerewolfVote[];
  [SERVER_SOCKET_EVENTS.playerVote]: Vote[];
  [SERVER_SOCKET_EVENTS.channelStatus]: ChannelStatus;
  [SERVER_SOCKET_EVENTS.chatMessage]: OutgoingMessage;
};
export type ServerSocketEvent = keyof ServerSocketEventPayloads;

export type GameDataDTO = {
  gameId: string;
  ownerId: string;
  players: Player[];
  gameOptions: GameOptions;
  round: number;
};

export const PHASE_NAMES = {
  ROLE: (role: RoleName) => `${role}-phase` as const,
  NIGHT: 'Night-phase',
  DAY_PHASES: {
    NIGHT_RESULTS: `NightResults-phase`,
    DAY_RESULTS: `DayResults-phase`,
    VOTE: 'Voting-phase',
  },
  DAY: 'Day-phase',
  ROLE_ASSIGNMENT: 'RoleAssignment-phase',
  WAITING_FOR_GAME_START: 'WaitingForGameStart-phase',
} as const;

export type PlayerData = {
  id: string;
  username: string;
  role?: string;
  channels?: string[];
};

export type PlayerDTO = {
  id: string;
  username: string;
  isAlive: boolean;
  isConnected: boolean;
};
