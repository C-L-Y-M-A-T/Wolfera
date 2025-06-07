import { forwardRef, Module } from '@nestjs/common';

import { DiscoveryModule } from '@nestjs/core';
import { GameController } from '../controllers/game.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/users/user.module';
import { GameEntity } from '../entities/game.entity';
import { PlayerGameResult } from '../entities/player-game-result.entity';
import { GameHandlerRegistry } from '../events/event-handler-registry.service';
import { GameResolver } from '../graphql/game.resolver';
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
    forwardRef(() => UserModule),
  ],
  providers: [
    GameService,
    RoleService,
    GameHandlerRegistry,
    GamePersistenceService,
    GameResolver,
  ],
  controllers: [GameController],
  exports: [GameService, GamePersistenceService],
})
export class GameModule {}
