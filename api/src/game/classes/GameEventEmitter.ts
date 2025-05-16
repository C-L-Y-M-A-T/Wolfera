// api/src/game/classes/GameEventEmitter.ts
import { Player } from './Player';
import { EventEmitter2 } from 'eventemitter2';

/**
 * Event emitter specific to a game instance
 * Handles broadcasting game events to players and handling internal game logic
 */
export class GameEventEmitter extends EventEmitter2 {
  /**
   * Emits an event to all connected players in the game
   * @param event The game event to emit
   * @param data Data associated with the event
   */
  broadcastToPlayers(event: string, data: any): void {
    this.emit(`broadcast:${event}`, data);
  }

  /**
   * Emits an event to a specific player
   * @param player The target player
   * @param event The game event to emit
   * @param data Data associated with the event
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
   * Emits an event to specific players
   * @param players The target players
   * @param event The game event to emit
   * @param data Data associated with the event
   */
  emitToPlayers(players: Player[], event: string, data: any): void {
    players.forEach((player) => {
      this.emitToPlayer(player, event, data);
    });
  }

  /**
   * Emits an event to all players with a specific role
   * @param roleName The target role name
   * @param event The game event to emit
   * @param data Data associated with the event
   * @param players All players to filter by role
   */
  emitToRole(
    roleName: string,
    event: string,
    data: any,
    players: Player[],
  ): void {
    const rolePlayers = players.filter(
      (player) => player.role?.roleData.name === roleName && player.isAlive,
    );
    this.emitToPlayers(rolePlayers, event, data);
  }
}
