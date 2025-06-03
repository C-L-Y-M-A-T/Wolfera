import { WsException } from '@nestjs/websockets';
import { GameContext } from 'src/game/classes/GameContext';
import { Player } from 'src/game/classes/Player';
import { WEREWOLF_ROLE_NAME } from '.';
import {
  WerewolfActionPayload,
  WerewolfVote,
  WerewolfVoteState,
} from './types';

export class WerewolfVoteManager {
  private voteState: WerewolfVoteState;

  constructor(private context: GameContext) {
    this.resetVotes();
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
   * Processes a werewolf vote
   */
  processVote(
    player: Player,
    action: WerewolfActionPayload,
  ): WerewolfVoteState {
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
  private processSkipVote(player: Player): WerewolfVoteState {
    // Add skip vote
    this.voteState.skipVotes.add(player.id);
    this.voteState.votes.delete(player.id);

    return this.checkForConsensus();
  }

  /**
   * Processes a target vote
   */
  private processTargetVote(
    player: Player,
    targetId: string,
  ): WerewolfVoteState {
    // Remove from skip votes if player was skipping
    this.voteState.skipVotes.delete(player.id);

    // Add new vote
    const vote: WerewolfVote = {
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
  private removePreviousVote(previousVote: WerewolfVote): void {
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
  private checkForConsensus(): WerewolfVoteState {
    const aliveWerewolves = this.getAliveWerewolves();
    const totalWerewolves = aliveWerewolves.length;
    const requiredVotes = Math.ceil(totalWerewolves / 2);

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
  getFinalResult(): {
    action: 'kill' | 'skip';
    target?: Player;
    cancelled?: boolean;
  } {
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
   * Gets current vote state (for debugging/monitoring)
   */
  getVoteState(): Readonly<WerewolfVoteState> {
    return { ...this.voteState };
  }

  /**
   * Gets all votes with player names for final summary
   */
  getVoteSummary(): WerewolfVoteState {
    return this.voteState;
  }

  /**
   * Checks if a player is a werewolf
   */
  isPlayerWerewolf(player: Player): boolean {
    return player.role?.roleData.name === WEREWOLF_ROLE_NAME;
  }

  /**
   * Gets all alive werewolves
   */
  getAliveWerewolves(): Player[] {
    return this.context
      .getAlivePlayers()
      .filter((player) => this.isPlayerWerewolf(player));
  }

  /**
   * Gets all eligible targets for werewolf actions
   */
  getEligibleTargets(): Player[] {
    return this.context
      .getAlivePlayers()
      .filter((player) => !this.isPlayerWerewolf(player));
  }
}
