import { GameService } from 'src/game/services/game/game.service';
import { WEREWOLF_ROLE_NAME } from 'src/roles/werewolf';
import { Player } from '../../classes/Player';
import { EventHandlerFactory } from '../decorators/event-handler.decorator';
import {
  GameEventHandler,
  OnGameEvent,
} from '../decorators/game-event.decorator';

interface WerewolfVoteData {
  targetId: string;
  voterId: string;
}

interface SeerActionData {
  targetId: string;
  result: boolean; // Is werewolf?
}

@EventHandlerFactory()
export class NightPhaseEventHandler implements GameEventHandler {
  private gameVotes: Map<string, Map<string, string>> = new Map();

  constructor(
    private readonly gameService: GameService,
    private readonly gameId: string, // Add gameId parameter since this is per-game
  ) {}

  @OnGameEvent('phase:night:start')
  handleNightStart(data: { gameId: string }): void {
    // Only handle events for this specific game instance
    if (data.gameId !== this.gameId) return;

    console.log(`Night phase started for game ${data.gameId}`);

    // Initialize voting tracking for this game
    this.gameVotes.set(data.gameId, new Map());

    const game = this.gameService.getGame(data.gameId);
    if (game) {
      // Notify all werewolves that it's time to vote
      const werewolves = this.getWerewolves(game);

      werewolves.forEach((werewolf) => {
        game.gameEventEmitter.emitToPlayer(werewolf, 'werewolf:vote-request', {
          targets: game
            .getAlivePlayers()
            .filter((p) => !this.isWerewolf(p))
            .map((p) => ({
              id: p.id,
              username: p.profile.id,
            })),
          timeout: 30000, // 30 seconds to vote
        });
      });
    }
  }

  @OnGameEvent('werewolf:vote')
  handleWerewolfVote(data: WerewolfVoteData & { gameId: string }): void {
    // Only handle events for this specific game instance
    if (data.gameId !== this.gameId) return;

    const { gameId, voterId, targetId } = data;
    console.log(`Werewolf ${voterId} voted to kill player ${targetId}`);

    // Store the vote
    const gameVotes = this.gameVotes.get(gameId);
    if (gameVotes) {
      gameVotes.set(voterId, targetId);

      // Check if all werewolves have voted
      const game = this.gameService.getGame(gameId);
      if (game) {
        const werewolves = this.getWerewolves(game);
        const allVoted = werewolves.every((wolf) => gameVotes.has(wolf.id));

        if (allVoted) {
          this.processWerewolfVotes(gameId);
        }
      }
    }
  }

  @OnGameEvent('seer:check')
  handleSeerCheck(data: {
    gameId: string;
    playerId: string;
    targetId: string;
  }): void {
    // Only handle events for this specific game instance
    if (data.gameId !== this.gameId) return;

    const { gameId, playerId, targetId } = data;
    const game = this.gameService.getGame(gameId);

    if (game) {
      const target = game.players.get(targetId);
      if (target) {
        const isWerewolf = this.isWerewolf(target);

        // Send result only to the seer
        const seer = game.players.get(playerId);
        if (seer && seer.isConnected()) {
          game.gameEventEmitter.emitToPlayer(seer, 'seer:result', {
            targetId,
            targetName: target.profile.id,
            isWerewolf,
          });
        }
      }
    }
  }

  @OnGameEvent('phase:night:end')
  handleNightEnd(data: { gameId: string }): void {
    // Only handle events for this specific game instance
    if (data.gameId !== this.gameId) return;

    console.log(`Night phase ended for game ${data.gameId}`);

    // Process any remaining votes if needed
    if (this.gameVotes.has(data.gameId)) {
      this.processWerewolfVotes(data.gameId);
    }
  }

  private processWerewolfVotes(gameId: string): void {
    const gameVotes = this.gameVotes.get(gameId);
    const game = this.gameService.getGame(gameId);

    if (!gameVotes || !game) return;

    // Count votes
    const voteCounts = new Map<string, number>();
    for (const targetId of gameVotes.values()) {
      voteCounts.set(targetId, (voteCounts.get(targetId) || 0) + 1);
    }

    // Find player with most votes
    let maxVotes = 0;
    let victimId: string | null = null;

    for (const [targetId, count] of voteCounts.entries()) {
      if (count > maxVotes) {
        maxVotes = count;
        victimId = targetId;
      }
    }

    if (victimId) {
      const victim = game.players.get(victimId);
      if (victim) {
        // Kill the player
        victim.isAlive = false;

        // Emit event for the kill
        game.gameEventEmitter.emit('player:killed', {
          playerId: victimId,
          playerName: victim.profile.id,
          killedBy: 'werewolves',
        });
      }
    }

    // Clear votes for this game
    this.gameVotes.delete(gameId);
  }

  private getWerewolves(game: any): Player[] {
    return game.getAlivePlayers().filter((p) => this.isWerewolf(p));
  }

  private isWerewolf(player: Player): boolean {
    return player.role?.roleData.name === WEREWOLF_ROLE_NAME;
  }
}
