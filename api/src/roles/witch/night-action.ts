// src/roles/werewolf/night-action.ts

import { GameContext } from 'src/game/classes/GameContext';
import { Player } from 'src/game/classes/Player';
import { PlayerAction } from 'src/game/classes/types';
import { RolePhase } from 'src/game/phases/nightPhase/rolePhase/role.phase';
import witchRole from '.';
import { WitchActionPayload, witchActionSchema } from './types';

//TODO: consider creating a base class for night actions if they share common logic
export class WitchNightPhase extends RolePhase<WitchActionPayload> {
  constructor(context: GameContext) {
    super(context, witchRole, witchActionSchema);
  }

  get phaseDuration(): number {
    return 0;
  }

  async onStart() {
    // this.context.emmit('witch:night:start', {
    // 'Choose a victim...',
    // }
    // );
    console.log('witch night phase started');
  }
  async onEnd() {
    // this.context.emmit('witch:night:end', {
    //   message: 'Night phase is over.',
    // });
    // console.log('witch night phase ended');
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
