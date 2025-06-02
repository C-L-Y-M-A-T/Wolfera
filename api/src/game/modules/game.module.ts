import { Module } from '@nestjs/common';

import { DiscoveryModule } from '@nestjs/core';
import { GameController } from '../controllers/game.controller';

import { GameService } from '../services/game/game.service';
import { RoleService } from '../services/role/role.service';
import { GameEventsModule } from './game-events.module';
import { GameHandlerRegistry } from '../events/event-handler-registry.service';
import { GameOptionsValidatorService } from '../services/game/game-options-validator.service';

@Module({
  imports: [DiscoveryModule, GameEventsModule],
  providers: [
    GameService,
    RoleService,
    GameHandlerRegistry,
    GameOptionsValidatorService,
  ],
  controllers: [GameController],
  exports: [GameService],
})
export class GameModule {}
