import { Controller, Injectable, Post } from '@nestjs/common';
import { tempGameOptions } from 'src/dummyData/gameParams';
import { GameService } from '../services/game/game.service';

@Injectable()
@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Post('create')
  async createGame() {
    //TODO: read user and game options from request, and validate them
    // user is the active user from auth
    // game option are from the request body
    const tempUser = { id: '123' };
    const gameOptions = tempGameOptions;
    const game = await this.gameService.createGame(tempUser, gameOptions);
    return {
      gameId: game.gameId,
    }; //TODO: create dto for output
  }
}
