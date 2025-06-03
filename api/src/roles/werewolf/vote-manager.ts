import { GameContext } from 'src/game/classes/GameContext';
import { Player } from 'src/game/classes/Player';
import { GenericVoteManager } from 'src/game/services/vote-manager/vote-manager.service';
import { WEREWOLF_ROLE_NAME } from '.';

export class WerewolfVoteManager extends GenericVoteManager {
  constructor(context: GameContext) {
    super(context);
  }

  protected canPlayerVote(player: Player): boolean {
    return player.role?.roleData.name === WEREWOLF_ROLE_NAME;
  }

  protected getRequiredVotes(eligibleVoters: Player[]): number {
    return Math.ceil(eligibleVoters.length / 2);
  }

  protected isEligibleTarget(player: Player): boolean {
    return player.role?.roleData.name !== WEREWOLF_ROLE_NAME;
  }
}
