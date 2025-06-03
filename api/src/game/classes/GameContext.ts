// Updated GameContext.ts with event handling
import { Injectable } from '@nestjs/common';
import { GameSocket } from 'src/socket/socket.types';

import { WsException } from '@nestjs/websockets';
import { LoggerService } from 'src/logger/logger.service';
import { SEER_ROLE_NAME } from 'src/roles/seer';
import { WEREWOLF_ROLE_NAME } from 'src/roles/werewolf';
import { User } from 'src/users/entities/user.entity';
import { OnGameEvent } from '../events/event-emitter/decorators/game-event.decorator';
import { GameEventEmitter } from '../events/event-emitter/GameEventEmitter';
import { events } from '../events/event.types';
import { ChainPhaseOrchestrator } from '../phases/orchertrators/ChainPhaseOrchestrator';
import { WaitingForGameStartPhase } from '../phases/waitingForGameStart/WatitingForGameStart.phase';
import { RoleService } from '../services/role/role.service';
import { GamePhase } from './GamePhase';
import { Player } from './Player';
import {
  GameOptions,
  GameResult,
  PlayerAction,
  PlayerActionSchema,
  SERVER_SOCKET_EVENTS,
  ServerSocketEvent,
  ServerSocketEventPayloads,
} from './types';

@Injectable()
export class GameContext {
  public players: Map<string, Player> = new Map();
  public gameId: string;
  private _owner: Player;
  public gameEventEmitter = new GameEventEmitter(this);
  public gameResults: GameResult;
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
    this.gameEventEmitter.registerGameEventHandler(this);
    this.orchestrator.execute();
  }

  isEmpty() {
    return this.players.size === 0;
  }

  addPlayer(user: User): Player {
    this.loggerService.debug('Adding player:', user);
    const player = new Player(user, this);
    this.players.set(user.id, player);
    this.gameEventEmitter.emit(events.GAME.PLAYER_JOIN, {
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
      this.players.delete(userId); // TODO: maybe consider marking as inactive instead of deleting (for rejoining for example)
      this.gameEventEmitter.emit(events.GAME.PLAYER_LEAVE, {
        playerId: userId,
      });

      // If owner left, try to assign a new owner
      if (this._owner && this._owner.id === userId && this.players.size > 0) {
        this._owner = this.getplayers()[0];
        this.gameEventEmitter.emit(events.GAME.OWNER_CHANGED, {
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
    this.broadcastToPlayers(SERVER_SOCKET_EVENTS.gameEnded, this.gameResults);
    this.players.forEach((player) => {
      player.disconnect();
    });
    this.gameEventEmitter.emit(events.GAME.END, {
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

    this.gameEventEmitter.emit(events.GAME.PLAYER_ACTION, {
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
  }

  @OnGameEvent(events.GAME.PHASE.START('*')) //TODO: add typing for payload
  async onPhaseStart(phase: GamePhase): Promise<void> {
    console.log(`Phase started: ${phase.phaseName}`);
    // Handle phase start logic here
    // For example, you can emit an event to notify players
    this.broadcastToPlayers(SERVER_SOCKET_EVENTS.phaseStarted, {
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
    this.broadcastToPlayers(SERVER_SOCKET_EVENTS.phaseEnded, {
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
  public broadcastToPlayers<E extends ServerSocketEvent>(
    event: E,
    payload: ServerSocketEventPayloads[E],
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
  public emitToPlayer<E extends ServerSocketEvent>(
    player: Player,
    event: E,
    payload: ServerSocketEventPayloads[E],
  ): void {
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
