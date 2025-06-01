import { GameRole, RoleName } from 'src/roles';
import { ChainableGamePhase } from '../../chainablePhase';
import { GameContext } from '../../GameContext';
import { PhaseConstructor } from '../../types';
import { NightPhase } from '../nightPhase/night.phase';

export class RoleAssignmentPhase extends ChainableGamePhase {
  constructor(context: GameContext) {
    super(context);
  }
  getNextPhase?(): PhaseConstructor<ChainableGamePhase> | undefined {
    return NightPhase;
  }
  readonly phaseName = 'RoleAssignment-phase';

  get phaseDuration(): number {
    return 10;
  }

  async onStart(): Promise<void> {
    this.assignRoles();
  }

  protected onEnd(): void {
    // Notify players of their assigned roles
    this.context.getplayers().forEach((player) => {
      this.emitToPlayer(player, 'role-assigned', {
        role: player.role?.roleData.name,
      });
    });
  }

  protected validatePlayerAction(): void {
    // No player actions are expected in this phase
    throw new Error(`Player action is not allowed in ${this.phaseName} phase.`);
  }

  protected validatePlayerPermissions(): void {
    // No player actions are expected in this phase
    throw new Error(`Player action is not allowed in ${this.phaseName} phase.`);
  }

  assignRoles(): void {
    const roleMap = this.context.gameOptions.roles;
    const players = this.context.getplayers();
    const roles: GameRole[] = [];

    // Expand roles based on count
    Object.entries(roleMap).forEach(([roleName, count]) => {
      for (let i = 0; i < count; i++) {
        roles.push(
          this.context.rolesService.getRole(roleName as RoleName) as GameRole,
        );
      }
    });

    // Shuffle roles
    for (let i = roles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [roles[i], roles[j]] = [roles[j], roles[i]];
    }

    // Assign roles
    players.forEach((player, i) => {
      player.role = roles[i];
    });
  }
}
