// src/roles/werewolf/night-action.ts

import { GameContext } from 'src/game/classes/GameContext';
import { RolePhase } from 'src/game/classes/phases/rolePhase/role.phase';
import { Player } from 'src/game/classes/Player';
import witchRole, { WitchActionPayload, witchActionSchema } from '.';
import { PlayerAction } from '..';

//TODO: consider creating a base class for night actions if they share common logic
export class WitchNightPhase extends RolePhase<WitchActionPayload> {
  constructor(context: GameContext) {
    super(context, witchRole, witchActionSchema);
  }

  get phaseDuration(): number {
    return 0;
  }

  async onStart() {
    this.context.emmit('witch:night:start', {
      message: 'Choose a victim...',
    });
    console.log('witch night phase started');
  }
  async onEnd() {
    this.context.emmit('witch:night:end', {
      message: 'Night phase is over.',
    });
    console.log('witch night phase ended');
  }

  async processPlayerAction(
    player: Player,
    action: PlayerAction<WitchActionPayload>,
  ) {
    console.log(`witch called by ${player.id} with action:`, action);
    this.output = [action];
    this.end();
  }
}
