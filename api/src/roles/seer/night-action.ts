// src/roles/werewolf/night-action.ts

import { GameContext } from 'src/game/classes/GameContext';
import { RolePhase } from 'src/game/classes/phases/rolePhase/role.phase';
import { Player } from 'src/game/classes/Player';
import { PlayerAction } from 'src/game/classes/types';
import seerRole from '.';

//TODO: consider creating a base class for night actions if they share common logic
export class SeerNightPhase extends RolePhase {
  constructor(context: GameContext) {
    super(context, seerRole);
  }

  get phaseDuration(): number {
    return 0;
  }

  validatePlayerAction(player: Player, action: any): action is PlayerAction {
    return true;
  }

  async onStart() {
    this.context.emmit('seer:night:start', {
      message: 'Choose a victim...',
      alivePlayers: this.context.getAlivePlayers(),
    });
    console.log('seer night phase started');
  }
  async onEnd() {
    this.context.emmit('seer:night:end', {
      message: 'Night phase is over.',
    });
    console.log('seer night phase ended');
  }

  async processPlayerAction(player: Player, action: PlayerAction) {
    console.log(`seer called by ${player.id} with action:`, action);
    this.output = [action];
    this.end();
  }
}
