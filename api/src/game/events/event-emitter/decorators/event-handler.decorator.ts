export const GAME_HANDLER_FACTORY_METADATA = 'gameHandlerFactory';

/**
 * Decorator to mark a class as a game handler that should be instantiated per game
 */
export function EventHandlerFactory() {
  return function <T extends new (...args: any[]) => any>(constructor: T) {
    Reflect.defineMetadata(GAME_HANDLER_FACTORY_METADATA, true, constructor);
    return constructor;
  };
}
