import { Controller, Injectable, Post } from '@nestjs/common';
import { GameService } from '../services/game.service';

@Injectable()
@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Post('start')
  startGame() {
    const tempUser = { id: '123' };
    const game = this.gameService.createGame(tempUser);
    return {
      gameId: game.gameId,
    };
  }
}
