import { RoleName } from 'src/roles';
import { GameContext } from './GameContext';
import { GamePhase } from './GamePhase';
import { ChainableGamePhase } from './chainablePhase';

export enum PhaseState {
  Pending = 'pending',
  Pre = 'pre',
  Active = 'active',
  Post = 'post',
  Completed = 'completed',
}

//TODO: to think about the options we want to add
export type GameOptions = {
  roles: Record<RoleName, number>;
  totalPlayers: number;
  withMairElection?: boolean;
  voteTimeSeconds?: number;
  IsPrivate?: boolean;
};

export type PhaseConstructor<T extends ChainableGamePhase = GamePhase> = new (
  context: GameContext,
) => T;

export type PhaseName = `${string}-phase`;

//TODO: to implement type
export type PlayerAction = { action: string; data?: any };

/**
 * Game events that can be emitted during gameplay
 */
export const GameEvent = {
  phaseStart: 'phase:start',
  phaseEnd: 'phase:end',
  playerAction: 'player:action',
  playerEliminated: 'player:eliminated',
  playerJoined: 'player:join',
  playerLeft: 'player:leave',
  gameStart: 'game:start',
  gameEnd: 'game:end',
  nightStart: 'night:start',
  nightEnd: 'night:end',
  dayStart: 'day:start',
  dayEnd: 'day:end',
  voteStart: 'vote:start',
  voteEnd: 'vote:end',
  roleAction: 'role:action',
};
