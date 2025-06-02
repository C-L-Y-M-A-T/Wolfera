import { GamePhase } from './GamePhase';
import { PhaseConstructor } from './types';

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
