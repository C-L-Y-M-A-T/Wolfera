// src/game/modules/game-events.module.ts
import { LoggerService, Module, OnModuleInit } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { GAME_EVENT_METADATA } from '../events/event-emitter/decorators/game-event.decorator';

/**
 * Module that discovers and manages game event handlers across the application
 */
@Module({
  imports: [DiscoveryModule],
  providers: [],
})
export class GameEventsModule implements OnModuleInit {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly loggerService: LoggerService
  ) {}

  onModuleInit() {
    // Find all providers that implement GameEventHandler
    const providers = this.discoveryService.getProviders();
    const gameEventHandlers = providers.filter((wrapper) =>
      this.isGameEventHandler(wrapper),
    );

    // Log discovered handlers
    if (gameEventHandlers.length) {
      this.loggerService.log(
        `Found ${gameEventHandlers.length} game event handlers`
      );
    }
  }

  private isGameEventHandler(wrapper: InstanceWrapper): boolean {
    const { instance } = wrapper;
    if (!instance) return false;

    // Check if the class has game event metadata
    return (
      instance.constructor &&
      Reflect.getMetadata(GAME_EVENT_METADATA, instance.constructor) !==
        undefined
    );
  }
}
