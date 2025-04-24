import { GameRole } from 'src/roles';
import { GamePhase } from '../GamePhase';
import { Player } from '../Player';
import { PlayerAction } from '../types';

export class NightPhase extends GamePhase {
  readonly phaseName = 'Night-phase';
  private activeRoles: Array<GameRole>;
  private currentSubPhase: GamePhase;

  get phaseDuration(): number {
    return 0;
  }

  async onStart(): Promise<void> {
    this.context.emmit('game:night:start', undefined);
    this.output = await this.executeSubPhases();
    this.end();
  }

  protected async onPrePhase(): Promise<void> {
    this.context.emmit('game:night:pre', undefined);
  }
  protected async onPostPhase(): Promise<void> {
    this.context.emmit('game:night:post', undefined);
  }
  protected async onEnd(): Promise<void> {
    this.context.emmit('game:night:end', undefined);
  }

  async executeSubPhases(initialData?: any): Promise<any> {
    let currentData = { initialData };
    this.buildNightSubPhases();
    console.log('NightPhase: executePhases', this.activeRoles);
    for (const role of this.activeRoles) {
      if (role.nightPhase) {
        this.currentSubPhase = new role.nightPhase.class(this.context);
        currentData[role.roleData.name] =
          await this.currentSubPhase.executeAsync(currentData);
      }
    }

    return currentData;
  }

  public async handlePlayerAction(
    player: Player,
    action: PlayerAction,
  ): Promise<void> {
-  private currentSubPhase: GamePhase;
+  private currentSubPhase?: GamePhase;

  private buildNightSubPhases(): void {
    console.log('alive players', this.context.getAlivePlayers());
    const uniqueRoles = new Map<string, GameRole>();
    this.context
      .getAlivePlayers()
      .map((player) => player.role)
      .filter(
        (role): role is GameRole =>
          role !== undefined &&
          role.nightPhase !== undefined &&
          role.nightPhase.isActiveTonight(this.context),
      )
      .map((role) => {
        console.log('adding role to uniqueRoles', role);
        if (!uniqueRoles.has(role.roleData.name)) {
          uniqueRoles.set(role.roleData.name, role);
        }
      });
    this.activeRoles = Array.from(uniqueRoles.values()).sort(
      (a, b) =>
        (a.nightPhase?.nightPriority ?? -1) -
        (b.nightPhase?.nightPriority ?? -1),
    );
    console.log(
      'uniqueRoles',
      Array.from(uniqueRoles.values()).map((role) => role.roleData.name),
    );
    console.log('NightPhase: activeRoles', this.activeRoles);
  }
}
