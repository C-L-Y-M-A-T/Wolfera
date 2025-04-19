import { Controller, Injectable, Post } from '@nestjs/common';
import { GameService } from '../services/game.service';

@Injectable()
@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Post('create')
  startGame() {
    //TODO: read user and game options from request, and validate them
    // user is the active user from auth
    // game option are from the request body
    const tempUser = { id: '123' };
    const tempGameOptions = {
      numberOfPlayers: 4,
    };
    const game = this.gameService.createGame(tempUser, tempGameOptions);
    return {
      gameId: game.gameId,
    };
  }
}
