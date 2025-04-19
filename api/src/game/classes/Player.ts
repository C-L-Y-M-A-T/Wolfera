import { Socket } from 'socket.io';
import { GameSocket } from 'src/socket/socket.types';
import { User } from 'src/temp/temp.user';
import { GameContext } from './GameContext';

export class Player {
  public socket?: GameSocket;
  constructor(
    private user: User,
    private context: GameContext,
  ) {}
  public get id(): string {
    return this.user.id;
  }

  isConnected(): this is this & { socket: GameSocket } {
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
}
