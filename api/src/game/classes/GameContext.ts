// Updated GameContext.ts with event handling
import { Injectable, LoggerService } from '@nestjs/common';
import { GameSocket } from 'src/socket/socket.types';

import { WsException } from '@nestjs/websockets';
import { SEER_ROLE_NAME } from 'src/roles/seer';
import { WEREWOLF_ROLE_NAME } from 'src/roles/werewolf';
import { User } from 'src/users/entities/user.entity';
import { OnGameEvent } from '../events/event-emitter/decorators/game-event.decorator';
import { GameEventEmitter } from '../events/event-emitter/GameEventEmitter';
import { events } from '../events/event.types';
import { RoleService } from '../services/role/role.service';
import { ChainPhaseOrchestrator } from './ChainPhaseOrchestrator';
import { GamePhase } from './GamePhase';
import { WaitingForGameStartPhase } from './phases/waitingForGameStart/WatitingForGameStart.phase';
import { Player } from './Player';
import {
  GameOptions,
  GameResult,
  PlayerAction,
  PlayerActionSchema,
  serverSocketEvent,
} from './types';

@Injectable()
export class GameContext {
  public players: Map<string, Player> = new Map();
  public gameId: string;
  private _owner: Player;
  public gameEventEmitter: GameEventEmitter;
  public gameResults: GameResult = {
    winner: null,
    message: '',
  };
  private orchestrator = new ChainPhaseOrchestrator(
    this,
    WaitingForGameStartPhase,
  );
  public round: number = 0;
  public gameOptions: GameOptions;

  constructor(
    public rolesService: RoleService,
    public loggerService: LoggerService,
  ) {
    this.gameId = this.generateGameId();
    // Initialize game event emitter
    this.gameEventEmitter = new GameEventEmitter();
    this.registerEventHandlers(this);
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
    this.loggerService.log('Adding player:', user);
    const player = new Player(user, this);
    this.players.set(user.id, player);
    this.gameEventEmitter.emit('player:join', {
      player: player.profile,
    });
    return player;
  }

  connectPlayer(user: User, socket?: GameSocket): Player {
    const player = this.players.get(user.id) ?? this.addPlayer(user);
    if (socket) {
      player.connect(socket);
    }
    // TODO: emit player connected event
    // TODO: emit to all connected players is temporary
    this.players.forEach((p) => {
      if (p.isConnected() && p.id !== player.id) {
        p.socket.emit('joined', {
          player: player.profile.id,
        });
      }
    });
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

  checkGameEndConditions(): void {
    let results: GameResult | undefined = undefined;
    // TODO: check game end conditions
    const alivePlayers = this.getAlivePlayers();
    if (alivePlayers.length === 0) {
      results = {
        winner: 'werewolves',
        message: 'The werewolves have won! The village is overrun!',
      };
    } else {
      const werewolves = alivePlayers.filter(
        (player) => player.role?.roleData.name === WEREWOLF_ROLE_NAME,
      );
      if (werewolves.length === 0) {
        results = {
          winner: 'villagers',
          message: 'The villagers have won! The werewolves are extinct!',
        };
      } else if (werewolves.length === alivePlayers.length) {
        results = {
          winner: 'werewolves',
          message: 'The werewolves have won! The village is overrun!',
        };
      }
    }

    if (results) {
      this.gameResults = results;
      this.stop();
    }
  }

  stop(): void {
    this.broadcastToPlayers(serverSocketEvent.gameEnded, this.gameResults);
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

  //TODO: use async and await in all websocket triggered functions so that WsException can be thrown
  async handlePlayerAction(player: Player, action: any): Promise<void> {
    const ValidatedAction: PlayerAction = PlayerActionSchema.parse(
      action,
    ) as PlayerAction;

    this.gameEventEmitter.emit('player:action', {
      playerId: player.id,
      ValidatedAction,
    });

    await this.orchestrator.handlePlayerAction(player, ValidatedAction);
  }

  //TODO: to remove this function (just for testing)
  tempAsignRoles(): void {
    this.players.get('123')!.role =
      this.rolesService.getRole(WEREWOLF_ROLE_NAME);
    this.players.get('456')!.role = this.rolesService.getRole(SEER_ROLE_NAME);
    this.gameEventEmitter.emit('roles:assigned', { gameId: this.gameId });
  }

  @OnGameEvent(events.GAME.PHASE.START('*')) //TODO: add typing for payload
  async onPhaseStart(phase: GamePhase): Promise<void> {
    console.log(`Phase started: ${phase.phaseName}`);
    // Handle phase start logic here
    // For example, you can emit an event to notify players
    this.broadcastToPlayers('phase-start', {
      phaseName: phase.phaseName,
      startTime: phase.startTime,
      phaseDuration: phase.phaseDuration,
      //payload?? //TODO: add payload if needed
      round: this.round,
    });
  }
  @OnGameEvent(events.GAME.PHASE.END('*'))
  async onPhaseEnd(event: any): Promise<void> {
    console.log(`Phase ended: ${event.phaseName}`);
    // Handle phase end logic here
    // For example, you can emit an event to notify players
    this.broadcastToPlayers('phase-end', {
      phaseName: event.phaseName,
      round: this.round,
    });
  }

  /**
   *
   * Broadcasts an event to all connected players
   * @param event - The event name to broadcast
   * @param payload - The payload to send to players
   */
  protected broadcastToPlayers(
    event: string,
    payload: any,
    filter: (player: Player) => boolean = () => true,
  ) {
    this.players.forEach((player) => {
      if (filter(player)) this.emitToPlayer(player, event, payload);
    });
  }

  /**
   * Emits an event to a specific player
   * @param player - The player to send the event to
   * @param event - The event name
   * @param payload - The payload to send
   * @throws Error if the player is not connected
   */
  protected emitToPlayer(player: Player, event: string, payload: any): void {
    if (player.isConnected() && player.socket) {
      player.socket.emit(event, payload);
    } else {
      throw new WsException(`Player ${player.id} is not connected`);
    }
  }

  /**
   * Returns public game data to be sent to players.
   * Sensitive information like roles is omitted.
   */
  getPublicGameData(): any {
    return {
      gameId: this.gameId,
      round: this.round,
      ownerId: this._owner?.id,
      players: Array.from(this.players.values()).map((player) => ({
        id: player.id,
        username: player.profile?.username || 'Unknown',
        isAlive: player.isAlive,
        isConnected: player.isConnected(),
        // Do not include role or other sensitive info
      })),
      gameOptions: this.gameOptions,
      // Add other non-sensitive game state info as needed
      //roles = this.gameOptions?.roles
    };
  }
}
