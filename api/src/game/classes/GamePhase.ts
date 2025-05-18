import { GameContext } from './GameContext';
import { Player } from './Player';
import { PhaseName, PhaseState, PlayerAction } from './types';

export abstract class GamePhase<A extends PlayerAction = PlayerAction> {
  public phaseState: PhaseState = PhaseState.Pending;
  constructor(protected context: GameContext) {}
  abstract readonly phaseName: PhaseName;

  public startTime: number;
  protected abstract onStart(): Promise<void> | void;
  protected abstract onEnd(): Promise<void> | void;

  // Optional pre/post-phase hooks
  protected async onPrePhase?(): Promise<void>; // "The night is falling..."
  protected async onPostPhase?(): Promise<void>; // "The village wakes up..."

  // Timers (override in subclasses)
  get prePhaseDuration(): number {
    return 0;
  } // 3s pre-phase by default
  get phaseDuration(): number {
    return 0;
  } // Main phase duration (0 = manual)
  get postPhaseDuration(): number {
    return 3000;
  } // 3s post-phase by default

  private input?: any;
  private onComplete?: (output: any) => void;
  protected output?: any;
  // can be overridden in subclasses by using:
  // get prePhaseDuration() { return 1000; }
  // or
  // const prePhaseDuration = 1000;

  /**
   * Emits a phase-specific event through the game event emitter
   * @param event The event to emit
   * @param data The data to include with the event
   */
  protected emitPhaseEvent(event: string, data: any = {}): void {
    this.context.gameEventEmitter.emit(event, {
      ...data,
      phase: this.phaseName,
      phaseState: this.phaseState,
    });
  }

  /**
   * Broadcasts a phase event to all connected players
   * @param event The event to broadcast
   * @param data The data to include with the event
   */
  protected broadcastPhaseEvent(event: string, data: any = {}): void {
    this.context.gameEventEmitter.broadcastToPlayers(event, {
      ...data,
      phase: this.phaseName,
      phaseState: this.phaseState,
    });
  }

  public async executeAsync(input: any = {}): Promise<any> {
    return await new Promise((resolve) => {
      this.execute(input, (output) => {
        resolve(output);
      });
    });
  }

  async execute(input: any = {}, onComplete?: (output: any) => void) {
    this.input = input;
    this.onComplete = onComplete;

    console.log('Executing phase:', this.phaseName);
    if (this.phaseState !== PhaseState.Pending) {
      throw new Error(
        `Phase ${this.phaseName} is already running or completed.`,
      ); //TODO: handle this error
    }
    this.startTime = Date.now();

    this.context.gameEventEmitter.emit(`phase:start:${this.phaseName}`, this);
    // 1. Pre-phase
    this.phaseState = PhaseState.Pre;
    await this.onPrePhase?.();
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
    this.context.gameEventEmitter.emit(`phase:end:${this.phaseName}`, this);

    // 3. Post-phase
    if (this.postPhaseDuration > 0) await this.delay(this.postPhaseDuration);
    await this.onPostPhase?.();

    this.phaseState = PhaseState.Completed;
    this.onComplete?.(this.output);
  }

  public async handlePlayerAction(
    player: Player,
    action: PlayerAction,
  ): Promise<void> {
    if (this.phaseState !== PhaseState.Active) {
      throw new Error(
        `Phase ${this.phaseName} cannot handle action from state ${this.phaseState}.`,
      ); //TODO:  handle this error
    }
    this.validatePlayerAction?.(player, action);
    this.processPlayerAction?.(player, action as A);
  }
  /**
   *  This function validates:
   *  - If the player performing the action has the right to do it
   *  - If the action is valid for the current phase
   *  - If the action format is valid
   *
   *  If the action is valid, it is of type A.
   *  If not, it throws an error.
   *
   * @param player
   * @param action
   * @param processPlayerAction
   */
  protected validatePlayerAction?(
    player: Player,
    action: PlayerAction,
  ): action is A;

  protected async processPlayerAction?(
    player: Player,
    action: A,
  ): Promise<void>;

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
