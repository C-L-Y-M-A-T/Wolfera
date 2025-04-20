import { GameClientEvent } from './game/game-client-events';
import { GameServerEvent } from './game/game-server-events';
import { RoomClientEvent } from './room/room-client-events';
import { RoomServerEvent } from './room/room-server-events';

export enum SocketChannel {
  Room = 'room',
  Game = 'game',
  Chat = 'chat',
}

export type SocketMessage<T extends string, P = undefined> = {
  type: T;
  payload: P;
};

export type SocketEvent =
  | RoomClientEvent
  | RoomServerEvent
  | GameClientEvent
  | GameServerEvent;
