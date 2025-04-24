import { GameRole } from 'src/roles';
import { GamePhase } from '../../GamePhase';
import { PlayerAction } from '../../types';

export abstract class RolePhase<
  A extends PlayerAction = PlayerAction,
> extends GamePhase<A> {
  abstract readonly role: GameRole;
  get phaseName(): `${string}-phase` {
    return `${this.role.roleData.name}-phase`;
  }
}
