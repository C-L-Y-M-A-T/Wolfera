import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { User } from 'src/temp/temp.user';
import { GameContext } from '../classes/GameContext';
import { GameOptions } from '../classes/GameOptions';

@Injectable()
export class GameService {
  private games: Map<string, GameContext> = new Map();

  getGame(gameId: string): GameContext | undefined {
    return this.games.get(gameId);
  }

  //TODO: check if player is already in a game
  createGame(gameOwner: User, options: GameOptions): GameContext {
    const gameContext = new GameContext(gameOwner);
    this.games.set(gameContext.gameId, gameContext);
    return gameContext;
  }
  connectPlayer(user: User, gameId: string, socket: Socket): GameContext {
    const gameContext = this.games.get(gameId);
    if (!gameContext) {
      //todo: throw a better error
      throw new Error('Game not found');
    }
    gameContext.connectPlayer(user, socket);
    return gameContext;
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
