import { SocketMessage } from 'src/socket/events/types/events';

// Start event to start the game
export type Start = SocketMessage<'start'>;

export type CupidPick = SocketMessage<
  'cupid-pick',
  { players: [string, string] }
>;
export type WerewolvesPick = SocketMessage<
  'werewolves-pick',
  { player: string }
>;
export type SeerPeek = SocketMessage<'seer-peek', { player: string }>;
export type WitchPick = SocketMessage<
  'witch-pick',
  { player: string; action: 'save' | 'kill' }
>;

export type GameClientEvent =
  | Start
  | CupidPick
  | WerewolvesPick
  | SeerPeek
  | WitchPick;
