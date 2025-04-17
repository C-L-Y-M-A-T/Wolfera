import { Module } from '@nestjs/common';
import { ChatGateway } from 'src/socket/room.gateway';
import { GameController } from './controllers/game.controller';
import { GameService } from './services/game.service';

@Module({
  providers: [GameService, ChatGateway],
  controllers: [GameController],
  exports: [GameService],
})
export class GameModule {}
