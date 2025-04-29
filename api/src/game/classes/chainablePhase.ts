import { GameContext } from './GameContext';
import { GamePhase } from './GamePhase';
import { PlayerAction } from './types';

export abstract class ChainableGamePhase<
  A extends PlayerAction = PlayerAction,
> extends GamePhase<A> {
  /**
   * Optionally specify the next phase
   * @returns Either:
   * - A phase constructor to chain to
   * - Input for the next phase
   * - undefined to end the chain
   */
  abstract getNextPhase?():
    | {
        phase: new (context: GameContext) => ChainableGamePhase;
        input?: any;
      }
    | undefined;
}
