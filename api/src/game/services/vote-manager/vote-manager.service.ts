import { WsException } from '@nestjs/websockets';
import { GameContext } from 'src/game/classes/GameContext';
import { Player } from 'src/game/classes/Player';
import {
  Vote,
  VoteActionPayload,
  VoteResult,
  VoteState,
} from 'src/game/types/vote-manager.types';

export abstract class GenericVoteManager {
  protected voteState: VoteState;

  constructor(private context: GameContext) {
    this.resetVotes();
  }

  protected canPlayerVote(player: Player) {
    return player.isAlive;
  }

  // Function to determine required votes for consensus
  protected getRequiredVotes(eligibleVoters: Player[]) {
    return eligibleVoters.length / 2;
  }

  /**
   * Gets all eligible targets for this phase
   */
  protected isEligibleTarget(player: Player): boolean {
    return player.isAlive;
  }

  /**
   * Resets the voting state
   */
  resetVotes(): void {
    this.voteState = {
      votes: new Map(),
      targetVoteCounts: new Map(),
      hasConsensus: false,
      consensusTarget: undefined,
      skipVotes: new Set(),
    };
  }

  /**
   * Processes a vote from a player
   */
  processVote(player: Player, action: VoteActionPayload): VoteState {
    const previousVote = this.voteState.votes.get(player.id);
    if (previousVote) {
      this.removePreviousVote(previousVote);
    }

    if (action.action === 'skip') {
      return this.processSkipVote(player);
    } else if (action.action === 'vote' && action.targetId) {
      return this.processTargetVote(player, action.targetId);
    }

    throw new WsException({
      message: 'Invalid vote action',
      code: 'INVALID_VOTE_ACTION',
    });
  }

  /**
   * Processes a skip vote
   */
  private processSkipVote(player: Player): VoteState {
    this.voteState.skipVotes.add(player.id);
    this.voteState.votes.delete(player.id);
    return this.checkForConsensus();
  }

  /**
   * Processes a target vote
   */
  protected processTargetVote(player: Player, targetId: string): VoteState {
    // Remove from skip votes if player was skipping
    this.voteState.skipVotes.delete(player.id);

    // Add new vote
    const vote: Vote = {
      voterId: player.id,
      targetId,
      timestamp: Date.now(),
    };

    this.voteState.votes.set(player.id, vote);

    // Update target vote count
    const currentCount = this.voteState.targetVoteCounts.get(targetId) || 0;
    this.voteState.targetVoteCounts.set(targetId, currentCount + 1);

    return this.checkForConsensus();
  }

  /**
   * Removes a previous vote from the state
   */
  private removePreviousVote(previousVote: Vote): void {
    const prevCount =
      this.voteState.targetVoteCounts.get(previousVote.targetId) || 0;
    if (prevCount <= 1) {
      this.voteState.targetVoteCounts.delete(previousVote.targetId);
    } else {
      this.voteState.targetVoteCounts.set(previousVote.targetId, prevCount - 1);
    }
  }

  /**
   * Checks if consensus has been reached
   */
  private checkForConsensus(): VoteState {
    const eligibleVoters = this.getEligibleVoters();
    const requiredVotes = this.getRequiredVotes(eligibleVoters);

    // Check for skip consensus
    if (this.voteState.skipVotes.size >= requiredVotes) {
      this.voteState.hasConsensus = true;
      this.voteState.consensusTarget = undefined;
      return this.voteState;
    }

    // Check for target consensus
    for (const [
      targetId,
      voteCount,
    ] of this.voteState.targetVoteCounts.entries()) {
      if (voteCount >= requiredVotes) {
        this.voteState.hasConsensus = true;
        this.voteState.consensusTarget = this.context.players.get(targetId);
        return this.voteState;
      }
    }

    // No consensus yet
    this.voteState.hasConsensus = false;
    this.voteState.consensusTarget = undefined;
    return this.voteState;
  }

  /**
   * Gets the final result of the voting
   */
  getFinalResult(): VoteResult {
    if (this.voteState.hasConsensus) {
      if (this.voteState.consensusTarget) {
        return {
          action: 'kill',
          target: this.voteState.consensusTarget,
        };
      } else {
        return { action: 'skip' };
      }
    }

    // If no consensus, find the target with most votes
    let maxVotes = 0;
    let targetWithMostVotes: string | undefined;

    for (const [
      targetId,
      voteCount,
    ] of this.voteState.targetVoteCounts.entries()) {
      if (voteCount > maxVotes) {
        maxVotes = voteCount;
        targetWithMostVotes = targetId;
      }
    }

    // If skip votes are more than target votes, skip
    if (this.voteState.skipVotes.size >= maxVotes) {
      return { action: 'skip' };
    }

    return targetWithMostVotes
      ? {
          action: 'kill',
          target: this.context.players.get(targetWithMostVotes),
        }
      : { action: 'skip' };
  }

  /**
   * Checks if consensus has been reached
   */
  hasConsensus(): boolean {
    return this.voteState.hasConsensus;
  }

  /**
   * Gets current vote state
   */
  getVoteState(): Readonly<VoteState> {
    return { ...this.voteState };
  }

  /**
   * Gets all votes for final summary
   */
  getVoteSummary(): VoteState {
    return this.voteState;
  }

  /**
   * Gets all eligible voters for this phase
   */
  getEligibleVoters(): Player[] {
    return this.context
      .getAlivePlayers()
      .filter((player) => this.canPlayerVote(player));
  }
}
