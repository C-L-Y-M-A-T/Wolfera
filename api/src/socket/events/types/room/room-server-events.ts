import { SocketMessage } from 'src/socket/events/types/events';

export type PlayerJoined = SocketMessage<
  'player-joined',
  { playerName: string }
>;

export type PlayerLeft = SocketMessage<'player-left', { playerName: string }>;
export type PlayersList = SocketMessage<'players-list', { players: string[] }>;

export type RoomServerEvent = PlayerJoined | PlayerLeft | PlayersList;
