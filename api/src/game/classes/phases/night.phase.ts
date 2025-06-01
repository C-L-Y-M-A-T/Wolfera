import { GameRole } from 'src/roles';
import { ChainableGamePhase } from '../chainablePhase';
import { PhaseOrchestrator } from '../PhaseOrchestrator';
import { Player } from '../Player';
import { SequentialPhaseOrchestrator } from '../SequentialPhaseOrchestrator';
import { PhaseConstructor, PlayerAction } from '../types';
import { DayPhase } from './dayPhase/day.phase';

export class NightPhase extends ChainableGamePhase {
  getNextPhase?(): PhaseConstructor<ChainableGamePhase> | undefined {
    return DayPhase;
  }
  protected async onEnd(): Promise<void> {
    this.context.gameEventEmitter.emit('night:end', {
      nightNumber: this.context.round,
    });
  }
  readonly phaseName = 'Night-phase';
  private orchestrator: PhaseOrchestrator;
  private activeRoles: GameRole[] = [];

  async onPrePhase(): Promise<void> {
    this.context.gameEventEmitter.emit('night:pre', {
      nightNumber: this.context.round,
      message: 'The night is falling upon the village...',
    });
    this.orchestrator = this.createOrchestrator();
  }

  async onStart(): Promise<void> {
    this.context.gameEventEmitter.broadcastToPlayers('night:start', {
      nightNumber: this.context.round,
      activeRoles: this.activeRoles.map((role) => role.roleData.name),
    });

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
    this.context.gameEventEmitter.emit('night:player:action', {
      playerId: player.id,
      action,
      roleName: player.role?.roleData.name,
    });

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

    this.context.gameEventEmitter.emit('night:roles:assigned', {
      roles: this.activeRoles.map((role) => ({
        name: role.roleData.name,
        priority: role.nightPhase?.nightPriority ?? -1,
      })),
    });
  }

  protected validatePlayerPermissions(
    player: Player,
    action: PlayerAction<any>,
  ): void {
    return;
  }
}
