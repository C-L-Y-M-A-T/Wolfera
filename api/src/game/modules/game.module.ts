import { Module } from '@nestjs/common';

import { DiscoveryModule } from '@nestjs/core';
import { GameController } from '../controllers/game.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from '../entities/game.entity';
import { PlayerGameResult } from '../entities/player-game-result.entity';
import { GameHandlerRegistry } from '../events/event-handler-registry.service';
import { GamePersistenceHandler } from '../services/game/game-persistence.handler';
import { GamePersistenceService } from '../services/game/game-persistence.service';
import { GameService } from '../services/game/game.service';
import { RoleService } from '../services/role/role.service';
import { GameEventsModule } from './game-events.module';

@Module({
  imports: [
    DiscoveryModule,
    GameEventsModule,
    TypeOrmModule.forFeature([GameEntity]),
    TypeOrmModule.forFeature([PlayerGameResult]),
  ],
  providers: [
    GameService,
    RoleService,
    GameHandlerRegistry,
    GamePersistenceHandler,
    GamePersistenceService,
  ],
  controllers: [GameController],
  exports: [GameService],
})
export class GameModule {}
