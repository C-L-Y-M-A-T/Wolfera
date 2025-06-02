import { Controller, Get, Injectable, Post } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { tempGameOptions } from 'src/dummyData/gameParams';
import { events } from '../events/event.types';
import { GameService } from '../services/game/game.service';

@Injectable()
@Controller('game')
@Public()
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
    game.gameEventEmitter.emit(events.GAME.CREATE, {
      gameId: game.gameId,
    });
    return {
      gameId: game.gameId,
    }; //TODO: create dto for output
  }

  @Get('all')
  getAllGames() {
    const games = this.gameService.getAllGames();
    return {
      games: games.map((g) => ({
        gameId: g.gameId,
        ownerId: g.owner.id,
      })),
    };
  }
}
