import { Injectable } from '@nestjs/common';
import { SEER_ROLE_NAME } from 'src/roles/seer';
import { WEREWOLF_ROLE_NAME } from 'src/roles/werewolf';
import { GameSocket } from 'src/socket/socket.types';
import { User } from 'src/temp/temp.user';
import { EventEmitter } from 'stream';
import { ChatHandler } from '../chat/ChatHandler';
import { RoleService } from '../services/role/role.service';
import { ChainPhaseOrchestrator } from './ChainPhaseOrchestrator';
import { GameEventEmitter } from './GameEventEmitter';
import { WaitingForGameStartPhase } from './phases/waitingForGameStart/WatitingForGameStart.phase';
import { Player } from './Player';
import { GameOptions } from './types';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class GameContext {
  public eventEmitter: EventEmitter = new EventEmitter();
  public players: Map<string, Player> = new Map();
  public gameId: string;
  private _owner: Player;
  public gameEventEmitter: GameEventEmitter; //TODO: add event emitter type
  private orchestrator = new ChainPhaseOrchestrator(
    this,
    WaitingForGameStartPhase,
  );
  private chatHandler = new ChatHandler(this);
  public round: number = 0;
  public gameOptions: GameOptions; //TODO: add game options type

  //TODO: add options
  constructor(public rolesService: RoleService) {
    console.log('GameContext created, rolesService:', rolesService);
    this.gameId = this.generateGameId();
    this.orchestrator.execute();
    this.gameEventEmitter = new GameEventEmitter();
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Set up listeners for broadcast events
    this.gameEventEmitter.on('broadcast:*', (event: string, data: any) => {
      const actualEvent = event.replace('broadcast:', '');
      this.players.forEach((player) => {
        if (player.isConnected()) {
          player.socket.emit('game-event', {
            event: actualEvent,
            data,
          });
        }
      });
    });

    // Add more event listeners as needed
  }

  logEvents() {
    this.gameEventEmitter.on('*', (event, data) => {
      console.log('Game event:', event, data);
    });
  }

  isEmpty() {
    return this.players.size === 0;
  }

  addPlayer(user: User): Player {
    console.log('Adding player:', user);
    const player = new Player(user, this);
    this.players.set(user.id, player);
    this.gameEventEmitter.emitToPlayer(player, 'player:join', {
      player: player.profile,
    });
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
      this.gameEventEmitter.emit('player:leave', { playerId: userId });

      // If owner left, try to assign a new owner
      if (this._owner && this._owner.id === userId && this.players.size > 0) {
        this._owner = this.getplayers()[0];
        this.gameEventEmitter.emit('owner:changed', {
          newOwnerId: this._owner.id,
        });
      }
    } else {
      throw new Error(`Player with ID ${userId} not found`);
    }
  }

  stop(): void {
    this.players.forEach((player) => {
      player.disconnect();
    });
    this.gameEventEmitter.emit('game:end', {
      gameId: this.gameId,
    });
  }

  //todo: change generate game id
  generateGameId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  //TODO: to replace with event emitter
  emit(event: string, data: any): void {
    this.gameEventEmitter.broadcastToPlayers(event, data);
  }

  handlePlayerAction(player: Player, action: any): void {
    this.gameEventEmitter.emitToPlayer(player, 'player:action', action);
    this.orchestrator.handlePlayerAction(player, action);
  }

  //TODO: to remove this function (just for testing)
  tempAsignRoles(): void {
    this.players.get('123')!.role =
      this.rolesService.getRole(WEREWOLF_ROLE_NAME);
    this.players.get('456')!.role = this.rolesService.getRole(SEER_ROLE_NAME);
    this.gameEventEmitter.emit('roles:assigned', { gameId: this.gameId });
  }
}
