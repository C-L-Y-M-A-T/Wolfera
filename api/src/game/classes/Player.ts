import { Socket } from 'socket.io';
import { GameRole } from 'src/roles';
import { GameSocket } from 'src/socket/socket.types';
import { User } from 'src/temp/temp.user';
import { GameContext } from './GameContext';

export class Player {
  public socket?: GameSocket;
  public role?: GameRole;
  public isAlive: boolean = true;
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
}
