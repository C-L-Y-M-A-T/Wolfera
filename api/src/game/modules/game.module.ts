import { Module } from '@nestjs/common';

import { DiscoveryModule } from '@nestjs/core';
import { GameController } from '../controllers/game.controller';

import { GameHandlerRegistry } from '../services/event-handler-registry.service';
import { GameService } from '../services/game/game.service';
import { RoleService } from '../services/role/role.service';
import { GameEventsModule } from './game-events.module';

@Module({
  imports: [DiscoveryModule, GameEventsModule],
  providers: [
    GameService,
    RoleService,
    GameHandlerRegistry,
    // {
    //   provide: 'NightPhaseEventHandler_CLASS',
    //   useValue: NightPhaseEventHandler,
    // },
  ],
  controllers: [GameController],
  exports: [GameService],
})
export class GameModule {}
