import { WsException } from '@nestjs/websockets';
import { GameContext } from 'src/game/classes/GameContext';
import { RolePhase } from 'src/game/classes/phases/nightPhase/rolePhase/role.phase';
import { Player } from 'src/game/classes/Player';
import { events } from 'src/game/events/event.types';
import werewolfRole, {
  WEREWOLF_ROLE_NAME,
  WerewolfActionPayload,
  werewolfActionSchema,
} from '.';
import { WerewolfAction, WerewolfNightEndPayload } from './types';
import { WerewolfVoteManager } from './vote-manager';

export class WerewolfNightPhase extends RolePhase<WerewolfActionPayload> {
  private voteManager: WerewolfVoteManager;

  constructor(context: GameContext) {
    super(context, werewolfRole, werewolfActionSchema);
    this.voteManager = new WerewolfVoteManager(context);
  }

  get phaseDuration(): number {
    return 120000;
  }

  async onStart(): Promise<void> {
    console.log('-------------------Werewolf night started-----------------');
    this.voteManager.resetVotes();
  }
  async onEnd(): Promise<void> {
    // Get final voting result
    const result = this.voteManager.getFinalResult();
    const votes = this.voteManager.getVoteSummary();

    // Create end payload
    const endPayload: WerewolfNightEndPayload = {
      phase: 'Werewolf-phase',
      result,
      votes,
    };

    this.output = endPayload;
  }

  /**
   * Processes validated werewolf actions
   */
  async processPlayerAction(
    player: Player,
    action: WerewolfAction,
  ): Promise<void> {
    console.log(`Werewolf ${player.id} performed action:`, action);
    // Process the vote
    const voteUpdate = this.voteManager.processVote(player, action);

    // Broadcast vote update to werewolves
    this.emitToWerewolves(events.GAME.WEREWOLF.VOTE, voteUpdate);
  }

  /**
   * Emits events specifically to werewolf players
   */
  private emitToWerewolves(event: string, data: any): void {
    this.broadcastToPlayers(event, data, (plater) =>
      this.isPlayerWerewolf(plater),
    );
  }

  /**
   * Validates if a player can perform a werewolf action
   */
  protected validatePlayerAction(_: Player, action: WerewolfAction): boolean {
    // Validate specific action types
    switch (action.action) {
      case 'werewolf-vote':
        return this.validateTargetAction(action);
      case 'werewolf-skip':
        return true;
      default:
        throw new WsException({
          message: 'Invalid werewolf action',
          code: 'INVALID_TARGET',
        });
    }
  }

  /**
   * Checks if a player is a werewolf
   */
  isPlayerWerewolf(player: Player): boolean {
    return player.role?.roleData.name === WEREWOLF_ROLE_NAME;
  }

  /**
   * Validates target-based actions (vote)
   */
  private validateTargetAction(action: WerewolfAction): boolean {
    if (!action.targetId) {
      throw new WsException({
        message: 'Target ID is required for this action',
        code: 'INVALID_TARGET',
      });
    }

    const target = this.context.players.get(action.targetId);
    if (!target) {
      throw new WsException({
        message: 'Target not found',
        code: 'TARGET_NOT_FOUND',
      });
    }

    // Check if target is alive
    if (!target.isAlive) {
      throw new WsException({
        message: 'Target is not alive',
        code: 'TARGET_NOT_ALIVE',
      });
    }

    // Check if target is not a werewolf (werewolves cannot kill each other)
    if (this.isPlayerWerewolf(target)) {
      throw new WsException({
        message: 'Target is a werewolf',
        code: 'TARGET_IS_WEREWOLF',
      });
    }

    return true;
  }
}
