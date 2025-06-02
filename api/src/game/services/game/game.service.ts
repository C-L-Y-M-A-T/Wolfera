// src/game/services/game/game.service.ts (updated)
import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameOptions } from 'src/game/classes/types';
import { GameHandlerRegistry } from 'src/game/events/event-handler-registry.service';
import { User } from 'src/temp/temp.user';
import { GameContext } from '../../classes/GameContext';
import { GameOptionsValidatorService } from './game-options-validator.service';

@Injectable()
export class GameService {
  private games: Map<string, GameContext> = new Map();

  constructor(
    private moduleRef: ModuleRef,
    private handlerRegistry: GameHandlerRegistry,
    private gameContextValidator: GameOptionsValidatorService,
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

      game.gameEventEmitter.registerGameEventHandlers(instance);
    });

    // i want to log for each game each event handlers :
    this.games.forEach((game) => {
      console.log(game.gameId);
      console.log(game.gameEventEmitter.getHandlers());
    });

    return game;
  }

  private async createGameInstance(
    gameOwner: User,
    options: GameOptions,
  ): Promise<GameContext> {
    // Validate game options
    this.gameContextValidator.validateGameOptions(options);
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
      throw new WsException('Game not found');
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
      }
    }
  }
}
