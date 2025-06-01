// src/game/event-emitter/event-handlers/NightPhaseEventHandler.ts
import { GameService } from 'src/game/services/game/game.service';
import { WEREWOLF_ROLE_NAME } from 'src/roles/werewolf';
import { Player } from '../../classes/Player';
import { GameContext } from '../../classes/GameContext';
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
  playerId: string;
}

@EventHandlerFactory()
export class NightPhaseEventHandler implements GameEventHandler {
  // This handler is specific to ONE game, so we only need a simple Map for votes
  private werewolfVotes: Map<string, string> = new Map(); // voterId -> targetId
  private game: GameContext;

  constructor(
    private readonly gameService: GameService,
    private readonly gameId: string,
  ) {
    // Get the game instance once and store it
    const game = this.gameService.getGame(this.gameId);
    if (!game) {
      throw new Error(`Game ${gameId} not found during handler initialization`);
    }
    this.game = game;
  }

  @OnGameEvent('phase:night:start')
  handleNightStart(): void {
    console.log(`Night phase started for game ${this.gameId}`);

    // Clear any previous votes
    this.werewolfVotes.clear();

    // Notify all werewolves that it's time to vote
    const werewolves = this.getWerewolves();
    const targets = this.game
      .getAlivePlayers()
      .filter((p) => !this.isWerewolf(p))
      .map((p) => ({
        id: p.id,
        username: p.profile.id,
      }));

    werewolves.forEach((werewolf) => {
      this.game.gameEventEmitter.emitToPlayer(
        werewolf,
        'werewolf:vote-request',
        {
          targets,
          timeout: 30000, // 30 seconds to vote
        },
      );
    });
  }

  @OnGameEvent('werewolf:vote')
  handleWerewolfVote(data: WerewolfVoteData): void {
    const { voterId, targetId } = data;
    console.log(`Werewolf ${voterId} voted to kill player ${targetId}`);

    // Store the vote
    this.werewolfVotes.set(voterId, targetId);

    // Check if all werewolves have voted
    const werewolves = this.getWerewolves();
    const allVoted = werewolves.every((wolf) =>
      this.werewolfVotes.has(wolf.id),
    );

    if (allVoted) {
      this.processWerewolfVotes();
    }
  }

  @OnGameEvent('seer:check')
  handleSeerCheck(data: SeerActionData): void {
    const { playerId, targetId } = data;
    const target = this.game.players.get(targetId);

    if (!target) {
      console.warn(`Target player ${targetId} not found`);
      return;
    }

    const isWerewolf = this.isWerewolf(target);
    const seer = this.game.players.get(playerId);

    if (seer && seer.isConnected()) {
      this.game.gameEventEmitter.emitToPlayer(seer, 'seer:result', {
        targetId,
        targetName: target.profile.id,
        isWerewolf,
      });
    }
  }

  @OnGameEvent('phase:night:end')
  handleNightEnd(): void {
    console.log(`Night phase ended for game ${this.gameId}`);

    // Process any remaining votes
    this.processWerewolfVotes();
  }

  private processWerewolfVotes(): void {
    if (this.werewolfVotes.size === 0) {
      console.log('No werewolf votes to process');
      return;
    }

    // Count votes
    const voteCounts = new Map<string, number>();
    for (const targetId of this.werewolfVotes.values()) {
      voteCounts.set(targetId, (voteCounts.get(targetId) || 0) + 1);
    }

    // Find player with most votes (simple majority for now)
    let maxVotes = 0;
    let victimId: string | null = null;

    for (const [targetId, count] of voteCounts.entries()) {
      if (count > maxVotes) {
        maxVotes = count;
        victimId = targetId;
      }
    }

    if (victimId) {
      const victim = this.game.players.get(victimId);
      if (victim) {
        // Kill the player
        victim.isAlive = false;

        // Emit event for the kill
        this.game.gameEventEmitter.emit('player:killed', {
          playerId: victimId,
          playerName: victim.profile.id,
          killedBy: 'werewolves',
        });

        console.log(`Player ${victim.profile.id} was killed by werewolves`);
      }
    }

    // Clear votes after processing
    this.werewolfVotes.clear();
  }

  private getWerewolves(): Player[] {
    return this.game.getAlivePlayers().filter((p) => this.isWerewolf(p));
  }

  private isWerewolf(player: Player): boolean {
    return player.role?.roleData.name === WEREWOLF_ROLE_NAME;
  }
}
