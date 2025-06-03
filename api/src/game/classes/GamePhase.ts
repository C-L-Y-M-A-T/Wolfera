import { WsException } from '@nestjs/websockets';
import { RoleName } from 'src/roles';
import { z } from 'zod';
import { events } from '../events/event.types';
import { GameContext } from './GameContext';
import { Player } from './Player';
import {
  PhaseName,
  PhaseState,
  PlayerAction,
  serverSocketEvent,
} from './types';

export abstract class GamePhase<A = any> {
  public phaseState: PhaseState = PhaseState.Pending;
  constructor(
    protected context: GameContext,
    protected playerActionPayloadSchema?: z.ZodSchema,
  ) {}
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

  protected input?: any;
  private onComplete?: (output: any) => void;
  protected output?: any;
  // can be overridden in subclasses by using:
  // get prePhaseDuration() { return 1000; }
  // or
  // const prePhaseDuration = 1000;

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

    this.context.loggerService.log(
      `Executing phase: ${this.phaseName} with input:`,
      this.input,
    );
    if (this.phaseState !== PhaseState.Pending) {
      throw new Error(
        `Phase ${this.phaseName} is already running or completed.`,
      ); //TODO: handle this error
    }
    this.startTime = Date.now();

    // 1. Pre-phase
    this.phaseState = PhaseState.Pre;
    await this.onPrePhase?.();
    if (this.prePhaseDuration > 0) await this.delay(this.prePhaseDuration);

    // 2. Main phase
    this.phaseState = PhaseState.Active;
    await this.onStart();
    this.context.gameEventEmitter.emit(
      events.GAME.PHASE.START(this.phaseName),
      this,
    );

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
    this.context.gameEventEmitter.emit(
      events.GAME.PHASE.END(this.phaseName),
      this,
    );
    this.phaseState = PhaseState.Post;

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
      throw new WsException(
        `Phase ${this.phaseName} cannot handle action from state ${this.phaseState}.`,
      );
    }
    if (this.phaseName !== action.activePhase) {
      throw new WsException(
        `event received for phase ${action.activePhase}, but the active phase is ${this.phaseName}`,
      );
    }

    if (!player.isAlive)
      throw new WsException(
        `Player ${player.id /* TODO: change to name istead of id */} is not alive and cannot perform actions.`,
      );
    action = this.validateActionSchema(player, action);
    this.validatePlayerPermissions?.(player, action);
    this.validatePlayerAction?.(player, action);
    await this.processPlayerAction?.(player, action);
  }

  /**
   * Validates the player action using Zod schema
   * @param player - The player performing the action
   * @param action - The raw action to validate
   * @returns The validated and typed action
   * @throws Error if validation fails or player doesn't have permission
   */
  protected validateActionSchema(
    player: Player,
    action: PlayerAction,
  ): PlayerAction<A> {
    if (!this.playerActionPayloadSchema) {
      // If no schema provided, assume action is valid and cast it
      return action as PlayerAction<A>;
    }

    try {
      action.phasePayload = this.playerActionPayloadSchema.parse(
        action.phasePayload,
      ) as A;
      return action;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new WsException(
          `Invalid action format: ${error.errors.map((e) => e.message).join(', ')}`,
        );
      }
      throw error;
    }
  }

  /**
   * Override this method to add custom player permission validation
   * @param player - The player performing the action
   * @param action - The raw action
   */
  protected abstract validatePlayerPermissions(
    player: Player,
    action: PlayerAction<A>,
  ): void;

  /**
   * Override this method to process player actions
   * @param player - The player performing the action
   * @param action - The action to process
   */
  protected async processPlayerAction?(
    player: Player,
    action: PlayerAction<A>,
  ): Promise<void>;

  /**
   * Override this method to add custom player action validation
   * @param player - The player performing the action
   * @param action - The action to validate
   */
  protected validatePlayerAction?(
    player: Player,
    action: PlayerAction<A>,
  ): void;

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   *
   * Broadcasts an event to all connected players
   * @param event - The event name to broadcast
   * @param payload - The payload to send to players
   */
  protected broadcastToPlayers(
    event: string,
    payload: any,
    filter: (player: Player) => boolean = () => true,
  ) {
    this.context.players.forEach((player) => {
      if (filter(player)) this.emitToPlayer(player, event, payload);
    });
  }

  /**
   * Emits an event to a specific player
   * @param player - The player to send the event to
   * @param event - The event name
   * @param payload - The payload to send
   * @throws Error if the player is not connected
   */
  protected emitToPlayer(player: Player, event: string, payload: any): void {
    if (player.isConnected() && player.socket) {
      player.socket.emit(event, payload);
    } else {
      throw new WsException(`Player ${player.id} is not connected`);
    }
  }

  protected roleReveal(revealTo: Player, player: Player, roleName: RoleName) {
    this.emitToPlayer(revealTo, serverSocketEvent.roleRevealed, {
      playerId: player.id,
      role: roleName,
    });
  }
}
