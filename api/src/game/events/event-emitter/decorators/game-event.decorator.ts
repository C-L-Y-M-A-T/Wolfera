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
