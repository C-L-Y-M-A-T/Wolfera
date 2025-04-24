import { Module } from '@nestjs/common';

import { GameController } from './controllers/game.controller';
import { GameService } from './services/game/game.service';
import { RoleService } from './services/role/role.service';

@Module({
  providers: [GameService, RoleService],
  controllers: [GameController],
  exports: [GameService],
})
export class GameModule {}
