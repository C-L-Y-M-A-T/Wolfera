// src/game/services/game/game.service.ts (updated)
import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Socket } from 'socket.io';
import { GameOptions } from 'src/game/classes/types';
import { GameEventHandler } from 'src/game/event-emitter/decorators/game-event.decorator';
import { User } from 'src/temp/temp.user';
import { GameContext } from '../../classes/GameContext';

@Injectable()
export class GameService {
  private games: Map<string, GameContext> = new Map();
  private gameEventHandlers: Map<string, GameEventHandler[]> = new Map();

  constructor(private moduleRef: ModuleRef) {}

  getGame(gameId: string): GameContext | undefined {
    return this.games.get(gameId);
  }

  async createGame(
    gameOwner: User,
    options: GameOptions,
  ): Promise<GameContext> {
    // Create the game context
    const gameContext = await this.moduleRef.create(GameContext);

    // Initialize the game
    gameContext.setOptions(options);
    const player = gameContext.addPlayer(gameOwner);
    gameContext.owner = player;

    // Store the game
    this.games.set(gameContext.gameId, gameContext);

    // Initialize event handlers for this game
    this.initializeGameEventHandlers(gameContext);

    return gameContext;
  }

  private initializeGameEventHandlers(gameContext: GameContext): void {
    // Get event handlers registered for all games
    const gameEventHandlers = this.gameEventHandlers.get('global') || [];
    console.log(this.gameEventHandlers);

    // Register each handler with the game context
    for (const handler of gameEventHandlers) {
      gameContext.registerEventHandler(handler);
    }
  }

  /**
   * Register a service that handles game events for all games
   */
  registerGameEventHandler(handler: GameEventHandler): void {
    // Initialize global handlers array if needed
    if (!this.gameEventHandlers.has('global')) {
      this.gameEventHandlers.set('global', []);
    }

    // Add handler to global list
    this.gameEventHandlers.get('global')?.push(handler);

    // Register handler for all existing games
    for (const gameContext of this.games.values()) {
      gameContext.registerEventHandler(handler);
    }
  }

  /**
   * Register a handler for a specific game
   */
  registerGameEventHandlerForGame(
    gameId: string,
    handler: GameEventHandler,
  ): void {
    const gameContext = this.games.get(gameId);
    if (gameContext) {
      gameContext.registerEventHandler(handler);

      // Initialize game-specific handlers array if needed
      if (!this.gameEventHandlers.has(gameId)) {
        this.gameEventHandlers.set(gameId, []);
      }

      // Add handler to game-specific list
      this.gameEventHandlers.get(gameId)?.push(handler);
    }
  }

  //TODO: check if player is already in a game
  connectPlayer(user: User, gameId: string, socket: Socket): GameContext {
    const gameContext = this.games.get(gameId);
    if (!gameContext) {
      //todo: throw a better error
      throw new Error('Game not found');
    }
    gameContext.connectPlayer(user, socket);
    return gameContext;
  }

  getAllGames() {
    return Array.from(this.games.values());
  }

  leaveGame(gameId: string, userId: string): void {
    const gameContext = this.games.get(gameId);
    if (gameContext) {
      gameContext.removePlayer(userId);
      if (gameContext.isEmpty()) {
        gameContext.stop();
        this.games.delete(gameId);

        // Clean up game-specific event handlers
        this.gameEventHandlers.delete(gameId);
      }
    }
  }
}
