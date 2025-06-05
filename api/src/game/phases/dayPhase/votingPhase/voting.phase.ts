import { WsException } from '@nestjs/websockets';
import { GameContext } from 'src/game/classes/GameContext';
import { GamePhase } from 'src/game/classes/GamePhase';
import { Player } from 'src/game/classes/Player';
import { PlayerAction, SERVER_SOCKET_EVENTS } from 'src/game/classes/types';
import {
  VoteActionPayload,
  VoteState,
} from 'src/game/types/vote-manager.types';
import { VotingPhaseEndPayload } from './types';
import { VotePhaseManager } from './vote-manager';

export class VotingPhase extends GamePhase<VoteActionPayload> {
  private voteManager: VotePhaseManager;

  constructor(context: GameContext) {
    super(context);
    this.voteManager = new VotePhaseManager(context);
  }

  get phaseName(): `${string}-phase` {
    return 'Voting-phase';
  }

  get phaseDuration(): number {
    return 20 * 1000; // 5 seconds for voting
  }

  protected async onStart(): Promise<void> {
    console.log('-------------------Day Voting Phase started-----------------');
    this.voteManager.resetVotes();
  }
  protected async onEnd(): Promise<void> {
    // Get final voting result
    const result = this.voteManager.getFinalResult();
    const votes = this.voteManager.getVoteSummary();

    // Create end payload
    const endPayload: VotingPhaseEndPayload = {
      phase: 'Voting-phase',
      result,
      votes,
    };

    this.output = endPayload;
  }

  /**
   * Processes validated player actions
   */
  async processPlayerAction(
    player: Player,
    action: PlayerAction<VoteActionPayload>,
  ): Promise<void> {
    //this.context.loggerService.debug(`player ${player.id} performed action:`, action);
    // Process the vote
    const voteUpdate = this.voteManager.processVote(
      player,
      action.phasePayload,
    );

    this.broadcastToOthers(voteUpdate);
  }

  /**
   * Broadcasts the vote results to all werewolves
   */
  private broadcastToOthers(voteUpdate: VoteState): void {
    this.context.broadcastToPlayers(
      SERVER_SOCKET_EVENTS.playerVote,
      Array.from(voteUpdate.votes.values()),
    );
  }

  protected validatePlayerPermissions(
    player: Player,
    action: PlayerAction<VoteActionPayload>,
  ): void {}

  protected validatePlayerAction(
    player: Player,
    action: PlayerAction<VoteActionPayload>,
  ): void {
    // Validate specific action types
    switch (action.phasePayload.action) {
      case 'vote':
        return this.validateTargetAction(action.phasePayload, player);
      case 'skip':
        return;
      default:
        throw new WsException({
          message: 'Invalid werewolf action',
          code: 'INVALID_TARGET',
        });
    }
  }

  /**
   * Validates target-based actions (vote)
   */
  private validateTargetAction(
    action: Extract<VoteActionPayload, { action: 'vote' }>,
    player: Player,
  ): void {
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
    if (target.id === player.id) {
      throw new WsException({
        message: 'Target cannot vote for themselves',
        code: 'TARGET_CANNOT_VOTE_FOR_SELF',
      });
    }
  }
}
