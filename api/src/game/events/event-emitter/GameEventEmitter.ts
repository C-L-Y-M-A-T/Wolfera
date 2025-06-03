// src/game/classes/GameEventEmitter.ts
import { EventEmitter2 } from '@nestjs/event-emitter';
import 'reflect-metadata';
import { GameContext } from 'src/game/classes/GameContext';
import { Player } from '../../classes/Player';
import {
  GAME_EVENT_METADATA,
  GameEventHandler,
} from './decorators/game-event.decorator';

/**
 * Game-specific event emitter that handles events within a game context
 */
export class GameEventEmitter {
  private eventEmitter: EventEmitter2;
  private handlers: GameEventHandler[];

  constructor(private readonly context: GameContext) {
    this.eventEmitter = new EventEmitter2({
      wildcard: true,
      delimiter: ':',
    });
    this.handlers = [];
  }

  /**
   * Function to register event handlers in a class instance to a game context
   *
   * @param instance The instance containing @OnGameEvent handlers
   * @param gameEventEmitter The EventEmitter2 instance from the game context
   */
  registerGameEventHandler(instance: any): void {
    const metadata = Reflect.getMetadata(
      GAME_EVENT_METADATA,
      instance.constructor,
    );

    if (!metadata) {
      this.context.loggerService.warn(
        `No game event metadata found for ${instance.constructor.name}`,
      );
      return;
    }

    // Register each handler method
    for (const { events, methodName } of metadata) {
      const handler = instance[methodName].bind(instance);

      for (const event of events) {
        this.eventEmitter.on(event, (data: any) => {
          try {
            handler(data);
          } catch (error) {
            this.context.loggerService.error(
              `Error in game event handler ${methodName} for event ${event}: ${error.message}`,
            );
          }
        });

        this.context.loggerService.log(
          `Registered handler ${instance.constructor.name}.${methodName} for event '${event}'`,
        );
      }
    }

    // Store the handler instance for reference
    this.handlers.push(instance);
  }

  /**
   * Emit an event within this game context
   */
  emit(event: string, data: any): boolean {
    return this.eventEmitter.emit(event, data);
  }

  /**
   * Listen for an event within this game context
   */
  on(event: string | string[], listener: (...args: any[]) => void): this {
    this.eventEmitter.on(event, listener);
    return this;
  }

  /**
   * Listen for an event once within this game context
   */
  once(event: string | string[], listener: (...args: any[]) => void): this {
    this.eventEmitter.once(event, listener);
    return this;
  }

  /**
   * Remove an event listener
   */
  off(event: string | string[], listener?: (...args: any[]) => void): this {
    if (listener) {
      this.eventEmitter.off(event, listener);
    }
    return this;
  }

  /**
   * Emit an event to a specific player
   */
  emitToPlayer(player: Player, event: string, data: any): void {
    if (player.isConnected()) {
      player.socket.emit('game-event', {
        event,
        data,
      });
    }
  }

  /**
   * Broadcast an event to all connected players
   */
  broadcastToPlayers(event: string, data: any): void {
    this.emit(`broadcast:${event}`, data);
  }

  /**
   * Get the underlying EventEmitter2 instance
   */
  getEventEmitter(): EventEmitter2 {
    return this.eventEmitter;
  }

  /**
   * Get all registered handlers for this game
   */
  getHandlers(): GameEventHandler[] {
    return [...this.handlers];
  }

  /**
   * Clean up all listeners when game ends
   */
  cleanup(): void {
    this.eventEmitter.removeAllListeners();
    this.handlers.length = 0;
    this.context.loggerService.log(`GameEventEmitter cleaned up`);
  }
}
