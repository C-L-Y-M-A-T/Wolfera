import { GamePhase } from '../classes/GamePhase';
import { PhaseConstructor } from '../classes/types';

export abstract class ChainableGamePhase<A = any> extends GamePhase<A> {
  /**
   * Optionally specify the next phase
   * @returns Either:
   * - A phase constructor to chain to
   * - Input for the next phase
   * - undefined to end the chain
   */
  abstract getNextPhase?(): PhaseConstructor<ChainableGamePhase> | undefined;
}
