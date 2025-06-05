import { Socket } from 'socket.io';
import { GameRole } from 'src/roles';
import { GameSocket } from 'src/socket/socket.types';

import { User } from 'src/users/entities/user.entity';
import { Serializable } from 'src/utils/serializable';
import { ChannelSubscription } from '../chat/chat.types';
import { events } from '../events/event.types';
import { GameContext } from './GameContext';

export class Player implements Serializable<PlayerDTO> {
  public socket?: GameSocket;
  public role?: GameRole;
  public isAlive: boolean = true;
  public channels: Map<string, ChannelSubscription> = new Map();
  constructor(
    public profile: User,
    private context: GameContext,
  ) {}
  public get id(): string {
    return this.profile.id;
  }

  isConnected(): this is { socket: GameSocket } {
    return this.socket !== undefined && this.socket.connected;
  }
  connect(socket: Socket): void {
    if (this.socket) {
      //throw new Error('Player is already connected to the game');
      this.socket.disconnect();
    }
    this.socket = socket;
    this.socket.data.player = this;
    this.socket.data.game = this.context;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
  equals(other: Player): boolean {
    return this.id === other.id;
  }
  die(): void {
    this.isAlive = false;
    this.context.gameEventEmitter.emit(events.GAME.PLAYER.KILLED, this);
  }

  assignRole(role: GameRole): void {
    this.role = role;
  }

  toDTO(): PlayerDTO {
    return {
      id: this.id,
      username: this.profile?.username || 'Unknown',
      isAlive: this.isAlive,
      isConnected: this.isConnected(),
      // Do not include role or other sensitive info
    };
  }
}

type PlayerDTO = {
  id: string;
  username: string;
  isAlive: boolean;
  isConnected: boolean;
};
