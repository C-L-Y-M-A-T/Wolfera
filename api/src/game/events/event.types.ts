import { PhaseName } from '../classes/types';

const CATEGORIES = {
  GAME: 'game',
  PHASE: 'phase',
  PLAYER: 'player',
  WEREWOLF: 'werewolf',
  SEER: 'seer',
  ROLES: 'roles',
  BROADCAST: 'broadcast',
  CHAT: 'chat',
  ERROR: 'error',
  SOCKET: 'socket',
  LOG: 'log',
} as const;

// Helper function to create namespaced events
const createEvent = (...parts: string[]): string => parts.join(':');

// Common action patterns
const ACTIONS = {
  START: 'start',
  END: 'end',
  JOIN: 'join',
  LEAVE: 'leave',
  CREATE: 'create',
  UPDATE: 'update',
  KILL: 'kill',
  CHECK: 'check',
  RESULT: 'result',
  VOTE: 'vote',
  TIMEOUT: 'timeout',
  ASSIGN: 'assign',
  ASSIGNED: 'assigned',
  REMOVED: 'removed',
  UPDATED: 'updated',
  MESSAGE: 'message',
} as const;

// Event factory functions for dynamic events
const createPhaseEvent = (
  phaseName: PhaseNameOrWildcard,
  action: string,
): string => createEvent(CATEGORIES.GAME, CATEGORIES.PHASE, phaseName, action);

const createPhaseActionVariant = (
  phaseName: PhaseNameOrWildcard,
  action: string,
  variant: string,
): string =>
  createEvent(CATEGORIES.GAME, CATEGORIES.PHASE, phaseName, action, variant);

// Core game events
const createGameEvents = () => ({
  // Basic game lifecycle
  START: createEvent(CATEGORIES.GAME, ACTIONS.START),
  END: createEvent(CATEGORIES.GAME, ACTIONS.END),
  JOIN: createEvent(CATEGORIES.GAME, ACTIONS.JOIN),
  LEAVE: createEvent(CATEGORIES.GAME, ACTIONS.LEAVE),
  CREATE: createEvent(CATEGORIES.GAME, ACTIONS.CREATE),
  UPDATE: createEvent(CATEGORIES.GAME, ACTIONS.UPDATE),

  // Player events
  PLAYER_JOIN: createEvent(CATEGORIES.GAME, CATEGORIES.PLAYER, ACTIONS.JOIN),
  PLAYER_LEAVE: createEvent(CATEGORIES.GAME, CATEGORIES.PLAYER, ACTIONS.LEAVE),
  PLAYER_ACTION: createEvent(CATEGORIES.GAME, CATEGORIES.PLAYER, 'action'),
  OWNER_CHANGED: createEvent(CATEGORIES.GAME, 'owner', 'changed'), //TODO: implement owner change logic
});

const createVoteEvents = (namespace: string) => ({
  VOTE: createEvent(CATEGORIES.GAME, namespace, ACTIONS.VOTE),
  VOTE_RESULT: createEvent(
    CATEGORIES.GAME,
    namespace,
    ACTIONS.VOTE,
    ACTIONS.RESULT,
  ),
  VOTE_TIMEOUT: createEvent(
    CATEGORIES.GAME,
    namespace,
    ACTIONS.VOTE,
    ACTIONS.TIMEOUT,
  ),
});

const createCheckEvents = (namespace: string) => ({
  CHECK: createEvent(CATEGORIES.GAME, namespace, ACTIONS.CHECK),
  RESULT: createEvent(CATEGORIES.GAME, namespace, ACTIONS.RESULT),
});

type PhaseNameOrWildcard = PhaseName | '*';
// Phase event creators
const createPhaseEvents = () => ({
  START: (phaseName: PhaseNameOrWildcard) =>
    createPhaseEvent(phaseName, ACTIONS.START),
  END: (phaseName: PhaseNameOrWildcard) =>
    createPhaseEvent(phaseName, ACTIONS.END),
  ACTION: (phaseName: PhaseNameOrWildcard, action: string) =>
    createPhaseEvent(phaseName, action),
  CHECK: (phaseName: PhaseNameOrWildcard, action: string) =>
    createPhaseActionVariant(phaseName, action, ACTIONS.CHECK),
  RESULT: (phaseName: PhaseNameOrWildcard, action: string) =>
    createPhaseActionVariant(phaseName, action, ACTIONS.RESULT),
  VOTE: (phaseName: PhaseNameOrWildcard, action: string) =>
    createPhaseActionVariant(phaseName, action, ACTIONS.VOTE),
  VOTE_RESULT: (phaseName: PhaseNameOrWildcard, action: string) =>
    createPhaseActionVariant(
      phaseName,
      action,
      `${ACTIONS.VOTE}:${ACTIONS.RESULT}`,
    ),
  VOTE_TIMEOUT: (phaseName: PhaseNameOrWildcard, action: string) =>
    createPhaseActionVariant(
      phaseName,
      action,
      `${ACTIONS.VOTE}:${ACTIONS.TIMEOUT}`,
    ),
});

// Specialized role events
const createPlayerEvents = () => ({
  KILLED: createEvent(CATEGORIES.GAME, CATEGORIES.PLAYER, 'killed'),
  ...createCheckEvents(CATEGORIES.PLAYER),
  ...createVoteEvents(CATEGORIES.PLAYER),
});

const createWerewolfEvents = () => ({
  VOTE_REQUEST: createEvent(
    CATEGORIES.GAME,
    CATEGORIES.WEREWOLF,
    'vote-request',
  ),
  KILL: createEvent(CATEGORIES.GAME, CATEGORIES.WEREWOLF, ACTIONS.KILL),
  KILL_RESULT: createEvent(
    CATEGORIES.GAME,
    CATEGORIES.WEREWOLF,
    ACTIONS.KILL,
    ACTIONS.RESULT,
  ),
  KILL_TIMEOUT: createEvent(
    CATEGORIES.GAME,
    CATEGORIES.WEREWOLF,
    ACTIONS.KILL,
    ACTIONS.TIMEOUT,
  ),
  ...createCheckEvents(CATEGORIES.WEREWOLF),
  ...createVoteEvents(CATEGORIES.WEREWOLF),
});

const createRoleEvents = () => ({
  ASSIGNED: createEvent(CATEGORIES.GAME, CATEGORIES.ROLES, ACTIONS.ASSIGNED),
  ASSIGN: createEvent(CATEGORIES.GAME, CATEGORIES.ROLES, ACTIONS.ASSIGN),
  REMOVED: createEvent(CATEGORIES.GAME, CATEGORIES.ROLES, ACTIONS.REMOVED),
  UPDATED: createEvent(CATEGORIES.GAME, CATEGORIES.ROLES, ACTIONS.UPDATED),
});

// Simple message events
const createMessageEvents = (category: string) => ({
  MESSAGE: createEvent(CATEGORIES.GAME, category),
});

// Main events object
export const events = {
  GAME: {
    ...createGameEvents(),
    PHASE: createPhaseEvents(),
    PLAYER: createPlayerEvents(),
    WEREWOLF: createWerewolfEvents(),
    SEER: createCheckEvents(CATEGORIES.SEER),
    ROLES: createRoleEvents(),
    BROADCAST: createMessageEvents(CATEGORIES.BROADCAST),
    CHAT: createMessageEvents(CATEGORIES.CHAT),
    ERROR: createMessageEvents(CATEGORIES.ERROR),
    SOCKET: createMessageEvents(CATEGORIES.SOCKET),
    LOG: createMessageEvents(CATEGORIES.LOG),
  },
} as const;

// Type definitions for better TypeScript support
export type GameEventKeys = keyof typeof events.GAME;
export type GameEvent = (typeof events.GAME)[GameEventKeys];

// Utility type for phase events
export type PhaseEventCreator = typeof events.GAME.PHASE;

// Example usage with type safety:
// const startEvent = events.GAME.START;
// const phaseStart = events.GAME.PHASE.START('night');
// const werewolfVote = events.GAME.WEREWOLF.VOTE;
