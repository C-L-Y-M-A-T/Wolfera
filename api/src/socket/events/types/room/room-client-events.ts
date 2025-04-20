import { SocketMessage } from 'src/socket/events/types/events';

export type Join = SocketMessage<'join', { playerId: string }>;
export type Leave = SocketMessage<'leave', { playerId: string }>;
export type Ready = SocketMessage<
  'ready',
  { playerId: string; ready: boolean }
>;

export type RoomClientEvent = Join | Leave | Ready;
