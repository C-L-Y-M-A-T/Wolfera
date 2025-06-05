/* eslint-disable @typescript-eslint/require-await */
import { GameRole } from 'src/roles';
import { Player } from '../../classes/Player';
import {
  PHASE_NAMES,
  PhaseConstructor,
  PlayerAction,
} from '../../classes/types';
import { ChainableGamePhase } from '../chainablePhase';
import { DayPhase } from '../dayPhase/day.phase';
import { PhaseOrchestrator } from '../orchertrators/PhaseOrchestrator';
import { SequentialPhaseOrchestrator } from '../orchertrators/SequentialPhaseOrchestrator';

export class NightPhase extends ChainableGamePhase {
  getNextPhase?(): PhaseConstructor<ChainableGamePhase> | undefined {
    return DayPhase;
  }
  protected async onEnd(): Promise<void> {}
  readonly phaseName = PHASE_NAMES.NIGHT;
  private orchestrator: PhaseOrchestrator;
  private activeRoles: GameRole[] = [];

  async onPrePhase(): Promise<void> {
    this.orchestrator = this.createOrchestrator();
  }

  async onStart(): Promise<void> {
    this.context.round++;
    this.output = await this.orchestrator.execute();
    this.end();
  }

  private createOrchestrator(): PhaseOrchestrator {
    this.buildNightSubPhases();
    const phaseDefinitions = this.activeRoles.map((role) => ({
      factory: () => new role.nightPhase!.class(this.context),
    }));

    return new SequentialPhaseOrchestrator(this.context, phaseDefinitions);
  }

  public async handlePlayerAction(
    player: Player,
    action: PlayerAction,
  ): Promise<void> {
    await this.orchestrator.handlePlayerAction(player, action);
  }

  private buildNightSubPhases(): void {
    const uniqueRoles = new Map<string, GameRole>();

    this.context
      .getAlivePlayers()
      .map((player) => player.role)
      .filter(
        (role): role is GameRole =>
          role !== undefined && role.nightPhase !== undefined,
      )
      .forEach((role) => {
        if (!uniqueRoles.has(role.roleData.name)) {
          uniqueRoles.set(role.roleData.name, role);
        }
      });

    this.activeRoles = Array.from(uniqueRoles.values()).sort(
      (a, b) =>
        (a.nightPhase?.nightPriority ?? -1) -
        (b.nightPhase?.nightPriority ?? -1),
    );
  }

  protected validatePlayerPermissions(): void {
    return; // No specific permissions needed for night phase
  }
}
