// src/game/decorators/gameEvent.decorator.ts
import 'reflect-metadata';

export const GAME_EVENT_METADATA = 'gameEventMetadata';

/**
 * Decorator for handling events emitted by a specific game instance.
 * Similar to NestJS's @OnEvent, but scoped to a specific game context.
 *
 * @param event The event name or pattern to listen for
 */
export function OnGameEvent(event: string | string[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    // Store event metadata for later binding
    const events = Array.isArray(event) ? event : [event];

    // Get existing metadata or initialize empty array
    const existingMetadata =
      Reflect.getMetadata(GAME_EVENT_METADATA, target.constructor) || [];

    // Add new event metadata
    const metadata = [...existingMetadata, { events, methodName: propertyKey }];

    // Update metadata on the class
    Reflect.defineMetadata(GAME_EVENT_METADATA, metadata, target.constructor);

    return descriptor;
  };
}

/**
 * Interface for handling game events
 */
export interface GameEventHandler {
  // This interface is a marker for classes that handle game events
}

/**
 * Function to register event handlers in a class instance to a game context
 *
 * @param instance The instance containing @OnGameEvent handlers
 * @param gameEventEmitter The EventEmitter2 instance from the game context
 */
export function registerGameEventHandlers(
  instance: any,
  gameEventEmitter: any,
): void {
  // Get metadata from the instance's constructor
  const metadata = Reflect.getMetadata(
    GAME_EVENT_METADATA,
    instance.constructor,
  );

  if (!metadata) {
    return;
  }
  // Register each handler
  for (const { events, methodName } of metadata) {
    const handler = instance[methodName].bind(instance);

    for (const event of events) {
      gameEventEmitter.on(event, (data: any) => {
        handler(data);
      });
    }
  }
}
