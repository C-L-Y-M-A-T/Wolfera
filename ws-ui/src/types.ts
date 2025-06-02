export type PhaseStartEvent = {
  startTime: number;
  duration: number;
  phaseName: PhaseName;
  phasePayload?: any;
};

export type PhaseName = `${string}-phase`;

export type User = {
  id: string;
  username: string;
  avatarUrl?: string;
};

export interface JoinedEvent {
  player: string;
}

export interface RoleAssignedEvent {
  role: string;
}

export interface WsException {
  message?: string;
}

export interface RoleRevealvent {
  role: string;
  playerId: string;
}

export interface CreateGameResponse {
  gameId: string;
}

export interface PlayerActionPayload {
  activePhase: string;
  timestamp: number;
  phasePayload: {
    action?: string;
    targetId?: string;
    [key: string]: any;
  };
}
export interface GameData {
  gameId: string;
  players: Player[];
  phase: string;
  owner?: Player;
  roles: RoleData[];
  gameOptions?: GameOptions;
  //[key: string]: any; // Allow for additional properties
}

export type Player = {
  id: string;
  role?: string;
  isConnected: boolean;

  username: string;

  isAlive?: boolean;
};

export type Team = "villagers" | "werewolves";

export type RoleData = {
  name: string;
  team: Team;
  description: string;
};

export type GameOptions = {
  roles: Record<string, number>;
  totalPlayers: number;
};

export type Phase = {
  phaseName: PhaseName;
  startTime: number; // Timestamp when the phase started
  duration: number; // Duration in seconds
  payload?: any; // Additional data for the phase
};
