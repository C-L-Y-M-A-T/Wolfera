import { GameSocket } from 'src/socket/socket.types';
import { User } from 'src/temp/temp.user';
import { Player } from './Player';

export class GameContext {
  isEmpty() {
    return this.players.size === 0;
  }
  private players: Map<string, Player> = new Map();
  public gameId: string;
  private gameOwner: Player;

  constructor(gameOwner: User) {
    this.gameId = this.generateGameId();
    this.addPlayer(gameOwner);
    this.setOwner(gameOwner.id);
  }
  addPlayer(user: User): Player {
    const player = new Player(user, this);
    this.players.set(user.id, player);
    return player;
  }
  connectPlayer(user: User | Player, socket?: GameSocket): Player {
    const player = this.players.get(user.id) ?? this.addPlayer(user);
    if (socket) {
      player.connect(socket);
    }
    return player;
  }

  setOwner(userId: string): void {
    const player = this.players.get(userId);
    if (player) {
      this.gameOwner = player;
    } else {
      throw new Error(`Player with ID ${userId} not found`);
    }
  }
  removePlayer(userId: string): void {
    const player = this.players.get(userId);
    if (player) {
      this.players.delete(userId);
    } else {
      throw new Error(`Player with ID ${userId} not found`);
    }
  }

  stop(): void {
    this.players.forEach((player) => {
      player.disconnect();
    });
  }

  //todo: change generate game id
  generateGameId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
