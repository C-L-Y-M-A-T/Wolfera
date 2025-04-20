import { GameClientEvent } from './game/game-client-events';
import { GameServerEvent } from './game/game-server-events';
import { RoomClientEvent } from './room/room-client-events';
import { RoomServerEvent } from './room/room-server-events';

export enum Events {
  Room = 'room',
  Game = 'game',
  Chat = 'chat',
}

export type SocketMessage<T extends string, P = undefined> = {
  type: T;
  payload: P & { roomCode: string | undefined };
  // roomCode is optional for events that don't require it
};

export type SocketEvent =
  | RoomClientEvent
  | RoomServerEvent
  | GameClientEvent
  | GameServerEvent;
