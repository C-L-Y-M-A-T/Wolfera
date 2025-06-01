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
    return 0;
  }

  async onStart(): Promise<void> {
    this.context.assignRoles();
    await this.end();
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
}
