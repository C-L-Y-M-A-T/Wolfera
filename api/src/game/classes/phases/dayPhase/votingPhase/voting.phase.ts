import { WsException } from '@nestjs/websockets';
import { GameContext } from 'src/game/classes/GameContext';
import { GamePhase } from 'src/game/classes/GamePhase';
import { Player } from 'src/game/classes/Player';
import { PlayerAction } from 'src/game/classes/types';
import { VotingPhasePayload } from './types';

export class VotingPhase extends GamePhase<VotingPhasePayload> {
  constructor(context: GameContext) {
    super(context);
  }

  get phaseName(): `${string}-phase` {
    return 'Voting-phase';
  }
  get phaseDuration(): number {
    return 0;
  }
  protected async onStart(): Promise<void> {
    console.log('VotingPhase started');
  }
  protected async onEnd(): Promise<void> {
    console.log('VotingPhase ended');
  }

  protected validatePlayerPermissions(
    player: Player,
    action: PlayerAction<VotingPhasePayload>,
  ): void {
    // Ensure the player is part of the game
    if (!this.context.players.has(player.id)) {
      throw new WsException(`Player ${player.id} is not part of the game.`);
    }

    // Ensure the player is alive
    if (!player.isAlive) {
      throw new WsException(
        `Player ${player.id} is not allowed to vote because they are dead.`,
      );
    }

    // Ensure the player is not the target of their own vote
    if (action.phasePayload.targetId === player.id) {
      throw new WsException(`Player ${player.id} cannot vote for themselves.`);
    }
  }
}
