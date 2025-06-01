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

  onStart(): void {
    // TODO: Assign roles to players
  }

  protected async onPrePhase(): Promise<void> {
    // TODO: Notify players that roles are being assigned
  }
  protected async onPostPhase(): Promise<void> {
    // No specific post-phase actions for role assignment
  }
  protected async onEnd(): Promise<void> {
    // TODO: inform players about their roles
  }

  protected async processPlayerAction(): Promise<void> {
    // No player actions are processed during role assignment phase
  }
  protected validatePlayerPermissions(): void {
    // No specific permissions needed for role assignment phase
  }
}
