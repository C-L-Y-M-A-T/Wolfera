// src/roles/werewolf/night-action.ts

import { GameContext } from 'src/game/classes/GameContext';
import { RolePhase } from 'src/game/classes/phases/nightPhase/rolePhase/role.phase';
import { Player } from 'src/game/classes/Player';
import { PlayerAction } from 'src/game/classes/types';
import seerRole from '.';
import { SeerActionPayload, SeerActionPayloadSchema } from './types';

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
    this.context.loggerService.log('seer night phase started');
  }
  async onEnd() {
    this.context.emit('seer:night:end', {
      message: 'Night phase is over.',
    });
    this.context.loggerService.log('seer night phase ended');
  }


  async processPlayerAction(
    player: Player,
    payload: PlayerAction<SeerActionPayload>,
  ) {
    this.context.loggerService.debug(
      `seer called by ${player.id} with action:`,
      payload.phasePayload.targetId,
    );
    this.output = [payload];
    this.end();
  }
}
