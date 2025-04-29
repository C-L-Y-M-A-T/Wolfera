import { Injectable } from '@nestjs/common';
import { SEER_ROLE_NAME } from 'src/roles/seer';
import { WEREWOLF_ROLE_NAME } from 'src/roles/werewolf';
import { GameSocket } from 'src/socket/socket.types';
import { User } from 'src/temp/temp.user';
import { ChatHandler } from '../chat/ChatHandler';
import { RoleService } from '../services/role/role.service';
import { GameOptions } from './GameOptions';
import { GamePhase } from './GamePhase';
import { NightPhase } from './phases/night.phase';
import { WaitingForGameStartPhase } from './phases/waitingForGameStart/WatitingForGameStart.phase';
import { Player } from './Player';

@Injectable()
export class GameContext {
  public players: Map<string, Player> = new Map();
  private chatHandler: ChatHandler = new ChatHandler(this);
  public gameId: string;
  private gameOwner: Player;
  private phase: GamePhase;
  public round: number = 0;
  public gameOptions: GameOptions; //TODO: add game options type

  //TODO: add options
  constructor(public rolesService: RoleService) {
    console.log('GameContext created, rolesService:', rolesService);
    this.gameId = this.generateGameId();
    this.phase = new WaitingForGameStartPhase(this);
    this.phase.execute();
  }
  isEmpty() {
    return this.players.size === 0;
  }
  addPlayer(user: User): Player {
    console.log('Adding player:', user);
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
  setOptions(options: any): void {
    this.gameOptions = options;
  }

  getplayers(): Player[] {
    return Array.from(this.players.values());
  }
  getAlivePlayers(): Player[] {
    return Array.from(this.players.values()).filter((player) => player.isAlive);
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

  async start() {
    //TODO: to implement real logic here, this is just to test the game
    if (this.phase.phaseName !== 'WaitingForGameStart-phase') {
      //TODO: not use string for phase name
      throw new Error('Game is already started');
    }
    this.tempAsignRoles();
    this.phase = new NightPhase(this);
    const result = await this.phase.executeAsync();
    console.log('Game ended with result: <<<<<<<<<', result, '>>>>>>>>>>>');
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

  handlePlayerAction(player: Player, action: any): void {
    this.phase.handlePlayerAction(player, action);
  }

  //TODO: to remove this function (just for testing)
  tempAsignRoles(): void {
    this.players.get('123')!.role =
      this.rolesService.getRole(WEREWOLF_ROLE_NAME);
    this.players.get('456')!.role = this.rolesService.getRole(SEER_ROLE_NAME);
  }
}
