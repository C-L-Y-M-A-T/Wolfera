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
    this.context.emit('seer:night:start', {
      message: 'Choose a victim...',
    });
    this.context.loggerService.log('seer night phase started');
  }
  async onEnd() {
    this.context.emit('seer:night:end', {
      message: 'Night phase is over.',
    });
    this.context.loggerService.log('seer night phase ended');
  }

  async processPlayerAction(player: Player, action: PlayerAction) {
    this.context.loggerService.log(`seer called by ${player.id} with action:`, action);
    this.output = [action];
    this.end();
  }
}
