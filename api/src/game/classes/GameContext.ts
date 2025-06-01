import { Injectable } from '@nestjs/common';
import { WEREWOLF_ROLE_NAME } from 'src/roles/werewolf';
import { GameSocket } from 'src/socket/socket.types';
import { User } from 'src/temp/temp.user';
import { RoleService } from '../services/role/role.service';
import { ChainPhaseOrchestrator } from './ChainPhaseOrchestrator';
import { WaitingForGameStartPhase } from './phases/waitingForGameStart/WatitingForGameStart.phase';
import { Player } from './Player';
import { GameOptions, PlayerAction, PlayerActionSchema } from './types';

@Injectable()
export class GameContext {
  public players: Map<string, Player> = new Map();
  public gameId: string;
  private _owner: Player;
  private eventEmitter: any; //TODO: add event emitter type
  private orchestrator = new ChainPhaseOrchestrator(
    this,
    WaitingForGameStartPhase,
  );
  public round: number = 0;
  public gameOptions: GameOptions; //TODO: add game options type

  //TODO: add options
  constructor(public rolesService: RoleService) {
    console.log('GameContext created, rolesService:', rolesService);
    this.gameId = this.generateGameId();
    this.orchestrator.execute();
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
    // TODO: emit player connected event
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

  get owner(): Player {
    return this._owner;
  }
  set owner(player: Player | User) {
    this.setOwner(player.id);
  }
  setOwner(userId: string) {
    const player = this.players.get(userId);
    if (player) {
      this._owner = player;
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
    const ValidatedAction: PlayerAction = PlayerActionSchema.parse(
      action,
    ) as PlayerAction;

    this.orchestrator.handlePlayerAction(player, ValidatedAction);
  }

  //TODO: to remove this function (just for testing)
  tempAsignRoles(): void {
    this.players.get('123')!.role =
      this.rolesService.getRole(WEREWOLF_ROLE_NAME);
    //this.players.get('456')!.role = this.rolesService.getRole(SEER_ROLE_NAME);
  }
}
