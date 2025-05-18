import { Module } from '@nestjs/common';

import { DiscoveryModule } from '@nestjs/core';
import { GameController } from '../controllers/game.controller';
import { NightPhaseEventHandler } from '../event-emitter/event-handlers/NightPhaseEventHandler';
import { GameService } from '../services/game/game.service';
import { RoleService } from '../services/role/role.service';
import { GameEventsModule } from './game-events.module';

@Module({
  imports: [DiscoveryModule, GameEventsModule],
  providers: [GameService, RoleService, NightPhaseEventHandler],
  controllers: [GameController],
  exports: [GameService],
})
export class GameModule {}
