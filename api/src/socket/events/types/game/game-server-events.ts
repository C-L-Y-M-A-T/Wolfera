import { SocketMessage } from 'src/socket/events/types/events';

// General game events
export type Started = SocketMessage<'started'>;
export type GameOver = SocketMessage<'over'>;

// Role assignment events
export type AssignRole = SocketMessage<
  'assign-role',
  { playerId: string; role: string }
>;

// Announcement event
export type Announcement = SocketMessage<
  'announcement',
  {
    killedByWerewolves: string | null;
    savedByWitch: string | null;
    killedByWitch: string | null;
    peekedBySeer: string | null;
  }
>;

// Phase start and end events
//
// TODO: Add more specific fields to the phase event
// PhaseType can be:
// |
// |- 'round'
// |- 'day' | 'night'
// |- Role: 'werewolf' | 'seer' | 'witch' | 'hunter' | 'villager'
// |- 'voting' | 'voting-results'

export type PhaseType = undefined;

export type StartPhase = SocketMessage<
  'phase-start',
  {
    phase: PhaseType;
    duration: number;
    startTime: Date;
    endTime: Date;
    description: string;
    round: number;

    // TODO: Add more specific fields
  }
>;

export type EndPhase = SocketMessage<'phase-end'>;

export type GameServerEvent =
  | Started
  | GameOver
  | AssignRole
  | StartPhase
  | EndPhase
  | Announcement;
