import { Module } from '@nestjs/common';

import { DiscoveryModule } from '@nestjs/core';
import { GameController } from '../controllers/game.controller';

import { GameService } from '../services/game/game.service';
import { RoleService } from '../services/role/role.service';
import { GameEventsModule } from './game-events.module';
import { GameHandlerRegistry } from '../events/event-handler-registry.service';

@Module({
  imports: [DiscoveryModule, GameEventsModule],
  providers: [GameService, RoleService, GameHandlerRegistry],
  controllers: [GameController],
  exports: [GameService],
})
export class GameModule {}
