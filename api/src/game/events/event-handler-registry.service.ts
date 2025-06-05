import { Injectable, OnModuleInit } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { GAME_HANDLER_FACTORY_METADATA } from '../events/event-emitter/decorators/event-handler.decorator';
import { GAME_EVENT_METADATA } from '../events/event-emitter/decorators/game-event.decorator';

export interface GameHandlerClass {
  new (gameService: any, gameId: string, ...args: any[]): any;
}

@Injectable()
export class GameHandlerRegistry implements OnModuleInit {
  private handlerClasses: GameHandlerClass[] = [];

  constructor(private readonly loggerService: LoggerService) {}

  onModuleInit() {
    // Register handler classes manually
    this.registerHandlerClasses();
  }

  private registerHandlerClasses() {
    // Import and register your handler classes here
    // This replaces the DiscoveryService approach
    const handlerClasses = this.getAvailableHandlerClasses();

    handlerClasses.forEach((HandlerClass) => {
      if (
        Reflect.getMetadata(GAME_HANDLER_FACTORY_METADATA, HandlerClass) &&
        Reflect.getMetadata(GAME_EVENT_METADATA, HandlerClass)
      ) {
        this.handlerClasses.push(HandlerClass);
        this.loggerService.verbose(
          `Registered game handler factory: ${HandlerClass.name}`,
        );
      }
    });
  }

  /**
   * Return all available handler classes
   * Add new handler classes to this array
   */
  private getAvailableHandlerClasses(): GameHandlerClass[] {
    // Import handler classes dynamically or statically
    // const {
    //   NightPhaseEventHandler,
    // } = require('./event-emitter/event-handlers/NightPhaseEventHandler');

    return [
      // NightPhaseEventHandler,
      // Add other handler classes here as you create them
    ];
  }

  /**
   * Create all handler instances for a specific game
   */
  createHandlersForGame(
    gameService: any,
    gameId: string,
  ): GameHandlerInstance[] {
    return this.handlerClasses.map((HandlerClass: GameHandlerClass) => {
      const instance = new HandlerClass(gameService, gameId);
      return {
        instance,
        className: HandlerClass.name,
        gameId,
      };
    });
  }

  getHandlerClasses(): GameHandlerClass[] {
    return [...this.handlerClasses];
  }
}

export interface GameHandlerInstance {
  instance: any;
  className: string;
  gameId: string;
}
