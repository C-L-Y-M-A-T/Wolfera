// src/roles/werewolf/night-action.ts

import { GameContext } from 'src/game/classes/GameContext';
import { RolePhase } from 'src/game/classes/phases/nightPhase/rolePhase/role.phase';
import { Player } from 'src/game/classes/Player';
import { PlayerAction } from 'src/game/classes/types';
import seerRole, { SeerActionPayload, SeerActionPayloadSchema } from '.';

//TODO: consider creating a base class for night actions if they share common logic
export class SeerNightPhase extends RolePhase<SeerActionPayload> {
  constructor(context: GameContext) {
    super(context, seerRole, SeerActionPayloadSchema);
  }

  get phaseDuration(): number {
    return 0;
  }

  async onStart() {
    this.context.emit('seer:night:start', {
      message: 'Choose a victim...',
    });
    console.log('seer night phase started');
  }
  async onEnd() {
    this.context.emit('seer:night:end', {
      message: 'Night phase is over.',
    });
    console.log('seer night phase ended');
  }

  async processPlayerAction(
    player: Player,
    payload: PlayerAction<SeerActionPayload>,
  ) {
    console.log(
      `seer called by ${player.id} with action:`,
      payload.phasePayload.targetId,
    );
    this.output = [payload];
    this.end();
  }
}
