// Updated GameContext.ts with event handling
import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { GameSocket } from 'src/socket/socket.types';
import { User } from 'src/temp/temp.user';

import { SEER_ROLE_NAME } from 'src/roles/seer';
import { WEREWOLF_ROLE_NAME } from 'src/roles/werewolf';
import { GameEventEmitter } from '../event-emitter/GameEventEmitter';
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
  public gameEventEmitter: GameEventEmitter;
  private orchestrator = new ChainPhaseOrchestrator(
    this,
    WaitingForGameStartPhase,
  );
  public round: number = 0;
  public gameOptions: GameOptions;

  constructor(
    public rolesService: RoleService,
    private moduleRef: ModuleRef,
  ) {
    this.gameId = this.generateGameId();
    // Initialize game event emitter
    this.gameEventEmitter = new GameEventEmitter();
    //this.setupEventListeners();
    this.orchestrator.execute();
  }

  // private setupEventListeners(): void {
  //   // Set up listeners for broadcast events
  //   this.gameEventEmitter.on('broadcast:*', (data: any) => {
  //     const event = this.gameEventEmitter.getEventEmitter().event;
  //     const actualEvent = event.replace('broadcast:', '');
  //     this.players.forEach((player) => {
  //       if (player.isConnected()) {
  //         player.socket.emit('game-event', {
  //           event: actualEvent,
  //           data,
  //         });
  //       }
  //     });
  //   });
  // }

  /**
   * Register a class that contains @OnGameEvent handlers
   */
  registerEventHandlers(handler: any): void {
    this.gameEventEmitter.registerGameEventHandlers(handler);
  }

  isEmpty() {
    return this.players.size === 0;
  }

  addPlayer(user: User): Player {
    console.log('Adding player:', user);
    const player = new Player(user, this);
    this.players.set(user.id, player);
    this.gameEventEmitter.emit('player:join', {
      player: player.profile,
    });
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

  //TODO: change generate game id
  generateGameId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  //TODO: to replace with event emitter
  emit(event: string, data: any): void {
    this.gameEventEmitter.broadcastToPlayers(event, data);
  }

  handlePlayerAction(player: Player, action: any): void {
    const ValidatedAction: PlayerAction = PlayerActionSchema.parse(
      action,
    ) as PlayerAction;

    this.gameEventEmitter.emit('player:action', {
      playerId: player.id,
      ValidatedAction,
    });

    this.orchestrator.handlePlayerAction(player, ValidatedAction);
  }

  //TODO: to remove this function (just for testing)
  tempAsignRoles(): void {
    this.players.get('123')!.role =
      this.rolesService.getRole(WEREWOLF_ROLE_NAME);
    this.players.get('456')!.role = this.rolesService.getRole(SEER_ROLE_NAME);
    this.gameEventEmitter.emit('roles:assigned', { gameId: this.gameId });
  }
}
