import { GameRole, RoleName } from 'src/roles';
import { WEREWOLF_ROLE_NAME } from 'src/roles/werewolf';
import { GameContext } from '../../classes/GameContext';
import {
  PHASE_NAMES,
  PhaseConstructor,
  SERVER_SOCKET_EVENTS,
} from '../../classes/types';
import { ChainableGamePhase } from '../chainablePhase';
import { NightPhase } from '../nightPhase/night.phase';

export class RoleAssignmentPhase extends ChainableGamePhase {
  constructor(context: GameContext) {
    super(context);
  }
  getNextPhase?(): PhaseConstructor<ChainableGamePhase> | undefined {
    return NightPhase;
  }
  readonly phaseName = PHASE_NAMES.ROLE_ASSIGNMENT;

  get phaseDuration(): number {
    return 10 * 1000;
  }

  async onStart(): Promise<void> {
    this.assignRoles();
    // Notify players of their assigned roles
    this.context.getplayers().forEach((player) => {
      this.emitToPlayer(player, SERVER_SOCKET_EVENTS.roleAssigned, {
        role: player.role?.roleData.name,
      });
    });
    this.shareWerewolfTeammates();
  }

  private shareWerewolfTeammates(): void {
    const werewolfPlayers = this.context
      .getplayers()
      .filter((player) => player.role?.roleData.name === WEREWOLF_ROLE_NAME);
    for (const player of werewolfPlayers) {
      for (const werewolf of werewolfPlayers) {
        this.roleReveal(player, werewolf, WEREWOLF_ROLE_NAME);
      }
    }
  }

  protected onEnd(): void {}

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
