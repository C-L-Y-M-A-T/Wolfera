import { GameSocket } from 'src/socket/socket.types';
import { User } from 'src/temp/temp.user';
import { GamePhase } from './GamePhase';
import { WaitingForGameStartPhase } from './phases/WatitingForGameStart.phase';
import { Player } from './Player';

export class GameContext {
  public players: Map<string, Player> = new Map();
  public gameId: string;
  private gameOwner: Player;
  private phase: GamePhase;

  constructor(gameOwner: User) {
    this.gameId = this.generateGameId();
    this.addPlayer(gameOwner);
    this.setOwner(gameOwner.id);
  }
  isEmpty() {
    return this.players.size === 0;
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
  start(): void {
    this.phase = new WaitingForGameStartPhase(this);
    this.phase.execute();
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

  //TODO: to replace with event emitter
  emmit(event: string, data: any): void {
    this.players.forEach((player) => {
      //player.socket?.emit(event, data);
      player.socket?.emit('game-event', {
        event,
        data,
      });
    });
  }
}
