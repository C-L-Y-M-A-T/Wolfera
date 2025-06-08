import { Body, Controller, Get, Injectable, Post } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { tempGameOptions } from 'src/dummyData/gameParams';
import { User } from 'src/users/entities/user.entity';
import { GameService } from '../services/game/game.service';

@Injectable()
@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Public()
  @Post('create')
  async createGame(@Body() body: any) {
    const tempUser: User = {
      id: body.userId,
      username: body.username || 'Temp User',
    } as User; // TODO: (after testing) This should be replaced with actual user retrieval logic
    const gameOptions = body.gameOptions || tempGameOptions; // This should be replaced with actual game options retrieval logic and validation
    const game = await this.gameService.createGame(tempUser, gameOptions);
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
