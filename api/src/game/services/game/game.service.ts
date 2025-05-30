// src/game/services/game/game.service.ts (updated)
import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Socket } from 'socket.io';
import { GameOptions } from 'src/game/classes/types';
import {
  GameEventHandler,
  registerGameEventHandlers,
} from 'src/game/event-emitter/decorators/game-event.decorator';
import { User } from 'src/temp/temp.user';
import { GameContext } from '../../classes/GameContext';
import { GameHandlerRegistry } from '../event-handler-registry.service';

@Injectable()
export class GameService {
  private games: Map<string, GameContext> = new Map();
  private gameEventHandlers: Map<string, GameEventHandler[]> = new Map();

  constructor(
    private moduleRef: ModuleRef,
    private handlerRegistry: GameHandlerRegistry,
  ) {}

  getGame(gameId: string): GameContext | undefined {
    return this.games.get(gameId);
  }

  async createGame(
    gameOwner: User,
    options: GameOptions,
  ): Promise<GameContext> {
    const game = await this.createGameInstance(gameOwner, options);

    // Automatically create all handler instances for this game
    const handlerInstances = this.handlerRegistry.createHandlersForGame(
      this,
      game.gameId,
    );

    handlerInstances.forEach(({ instance, className }) => {
      console.log(`Registering ${className} for game ${game.gameId}`);

      registerGameEventHandlers(instance, game.gameEventEmitter);
    });

    // Store handlers and cleanup functions for later cleanup
    this.gameEventHandlers.set(game.gameId, handlerInstances);

    // i want to log for each game each event handlers :
    console.log(this.gameEventHandlers);

    return game;
  }

  private async createGameInstance(
    gameOwner: User,
    options: GameOptions,
  ): Promise<GameContext> {
    const gameContext = await this.moduleRef.create(GameContext);
    // Initialize the game
    gameContext.setOptions(options);
    const player = gameContext.addPlayer(gameOwner);
    gameContext.owner = player;
    this.games.set(gameContext.gameId, gameContext);

    return gameContext;
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
