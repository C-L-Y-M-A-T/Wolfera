import { GameContext } from './GameContext';
import { PhaseState } from './types';

export abstract class GamePhase {
  constructor(protected context: GameContext) {}
  public phaseState: PhaseState = PhaseState.Pending;

  abstract readonly phaseName: string;

  public startTime: number;
  protected abstract onStart(): Promise<void> | void;
  protected abstract onEnd(): Promise<void> | void;

  // Optional pre/post-phase hooks
  protected async onPrePhase?(): Promise<void>; // "The night is falling..."
  protected async onPostPhase?(): Promise<void>; // "The village wakes up..."

  // Timers (override in subclasses)
  get prePhaseDuration(): number {
    return 3000;
  } // 3s pre-phase by default
  get phaseDuration(): number {
    return 0;
  } // Main phase duration (0 = manual)
  get postPhaseDuration(): number {
    return 3000;
  } // 3s post-phase by default

  // can be overridden in subclasses by using:
  // get prePhaseDuration() { return 1000; }
  // or
  // const prePhaseDuration = 1000;

  async execute() {
    console.log('Executing phase:', this.phaseName);
    if (this.phaseState !== PhaseState.Pending) {
      throw new Error(
        `Phase ${this.phaseName} is already running or completed.`,
      ); //TODO: handle this error
    }
    this.startTime = Date.now();

    // 1. Pre-phase
    this.phaseState = PhaseState.Pre;
    if (this.onPrePhase) await this.onPrePhase();
    if (this.prePhaseDuration > 0) await this.delay(this.prePhaseDuration);

    // 2. Main phase
    this.phaseState = PhaseState.Active;
    await this.onStart();

    if (this.phaseDuration > 0) {
      await this.delay(this.phaseDuration);
      await this.end();
    }
  }

  protected async end() {
    if (this.phaseState !== PhaseState.Active) {
      throw new Error(
        `Phase ${this.phaseName} cannot end from state ${this.phaseState}.`,
      ); //TODO: handle this error
    }
    await this.onEnd();
    this.phaseState = PhaseState.Post;

    // 3. Post-phase
    if (this.onPostPhase) await this.onPostPhase();
    if (this.postPhaseDuration > 0) await this.delay(this.postPhaseDuration);

    this.phaseState = PhaseState.Completed;
  }

  onPlayerAction(playerId: string, action: any): void {
    // This method is called when a player performs an action in the game phase
    // You can override this method in subclasses to implement custom behavior
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
