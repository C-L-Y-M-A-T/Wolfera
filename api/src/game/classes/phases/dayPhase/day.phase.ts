import { ChainableGamePhase } from '../../chainablePhase';
import { PhaseOrchestrator } from '../../PhaseOrchestrator';
import { Player } from '../../Player';
import { SequentialPhaseOrchestrator } from '../../SequentialPhaseOrchestrator';
import { PhaseConstructor, PlayerAction } from '../../types';
import { NightPhase } from '../nightPhase/night.phase';
import { DayResultsPhase } from './dayResultsPhase/dayResults.phase';
import { NightResultsPhase } from './nightResultsPhase/nightResults.phase';
import { VotingPhase } from './votingPhase/voting.phase';

export class DayPhase extends ChainableGamePhase {
  getNextPhase?(): PhaseConstructor<ChainableGamePhase> | undefined {
    return NightPhase;
  }
  protected async onEnd(): Promise<void> {}
  readonly phaseName = 'Day-phase';
  private orchestrator: PhaseOrchestrator;

  async onPrePhase(): Promise<void> {
    this.orchestrator = this.createOrchestrator();
  }

  async onStart(): Promise<void> {
    // this.context.emmit('game:day:start', undefined);
    this.output = await this.orchestrator.execute();
    this.end();
  }

  private createOrchestrator(): PhaseOrchestrator {
    const phases = [NightResultsPhase, VotingPhase, DayResultsPhase];
    const phaseInstances = phases.map((phase) => ({
      factory: () => new phase(this.context),
    }));
    return new SequentialPhaseOrchestrator(this.context, phaseInstances);
  }

  public async handlePlayerAction(
    player: Player,
    action: PlayerAction,
  ): Promise<void> {
    await this.orchestrator.handlePlayerAction(player, action);
  }

  protected validatePlayerPermissions(): void {
    return;
  }
}
