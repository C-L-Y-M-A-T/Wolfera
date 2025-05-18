// src/game/classes/GameEventEmitter.ts
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Player } from '../classes/Player';

/**
 * Game-specific event emitter that handles events within a game context
 */
export class GameEventEmitter {
  private eventEmitter: EventEmitter2;

  constructor() {
    this.eventEmitter = new EventEmitter2({
      wildcard: true,
      delimiter: ':',
    });
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
}
