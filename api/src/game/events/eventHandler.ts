import { GameContext } from '../classes/GameContext';

export abstract class EventHandler {
  constructor(protected context: GameContext) {
    this.context.gameEventEmitter.registerGameEventHandler(this);
  }
}
