import { GameRole } from 'src/roles';
import { GameContext } from '../../GameContext';
import { GamePhase } from '../../GamePhase';

export abstract class RolePhase<A = any> extends GamePhase<A> {
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
