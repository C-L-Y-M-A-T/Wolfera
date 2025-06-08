import { Socket } from "socket.io-client";
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
  id: string;
  username: string;
  isAlive: boolean;
  isConnected: boolean;
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

export interface IncomingGameData {
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
  phaseDuration: number; // Duration in seconds
  payload?: any; // Additional data for the phase
};

export type PlayerData = {
  id: string;
  username: string;
  role?: string;
  channels?: {
    name: string;
    isActive: boolean;
    subscriptionType: SubscriptionType;
  }[];
};

export enum SubscriptionType {
  READ_WRITE, // Can send and receive messages
  READ_ONLY, // Can only receive messages
}
export type Channel = {
  name: string;
  messages: IncomingMessage[];
  subscriptionType: SubscriptionType;
  isActive: boolean;
};
export type ChannelStatus = {
  channel: string;
  isActive: boolean;
};

type ChatProps = {
  gameData: GameData;
  channels: Channel[];
  onSendMessage?: (channelId: string, message: string) => void;
};

type BaseMessage = {
  id: string;
  type: "player_message" | "system_message";
  content: string;
  channel?: string;
};

export type PlayerMessage = BaseMessage & {
  sender_id: string;
  type: "player_message";
};

export type SystemMessage = BaseMessage & {
  type: "system_message";
};

export type IncomingMessage = PlayerMessage | SystemMessage;

export type PlayerActionPayload = {
  activePhase: string;
  timestamp: number;
  phasePayload: {
    action: string;
    targetId: string;
  };
};

export interface PlayerVote {
  voterId: string;
  targetId: string;
  timestamp: number;
}

export type DayVotingPhaseProps = {
  gameData: {
    players: Player[];
  };
  user: {
    id: string;
  };
  votes: PlayerVote[];
  setVotes: (votes: PlayerVote[]) => void;
  socket: Socket | null;
  sectionStyle?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
};
