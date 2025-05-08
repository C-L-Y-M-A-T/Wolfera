import { GameRole } from 'src/roles';
import { GameContext } from '../../GameContext';
import { GamePhase } from '../../GamePhase';
import { PlayerAction } from '../../types';

export abstract class RolePhase<
  A extends PlayerAction = PlayerAction,
> extends GamePhase<A> {
  constructor(
    context: GameContext,
    public readonly role: GameRole,
  ) {
    super(context);
  }
  get phaseName(): `${string}-phase` {
    return `${this.role.roleData.name}-phase`;
  }
}
