// src/roles/werewolf/night-action.ts

import { GameContext } from 'src/game/classes/GameContext';
import { RolePhase } from 'src/game/classes/phases/rolePhase/role.phase';
import { Player } from 'src/game/classes/Player';
import { PlayerAction } from 'src/game/classes/types';
import werewolfRole, { WerewolfActionPayload, werewolfActionScema } from '.';

export class WerewolfNightPhase extends RolePhase<WerewolfActionPayload> {
  constructor(context: GameContext) {
    super(context, werewolfRole, werewolfActionScema);
  }
  get phaseDuration(): number {
    return 0;
  }

  async onStart() {
    // Notify werewolves it's their turn

    // todo: implement emit to role/ emit to players under a certain condition like has or has not role
    this.context.emit('werewolf:night:start', {
      message: 'Choose a victim...',
    });
    console.log('Werewolf night phase started');
  }
  async onEnd() {
    // Notify werewolves the night phase is over
    this.context.emit('werewolf:night:end', {
      message: 'Night phase is over.',
    });
    console.log('Werewolf night phase ended');
  }

  async processPlayerAction(
    player: Player,
    payload: PlayerAction<WerewolfActionPayload>,
  ) {
    // Register the werewolf's kill vote
    //this.context.addNightAction('kill', action.targetId);
    console.log(
      `Werewolf ${player.profile.id} chose to kill ${payload.phasePayload.targetId}`,
    );
    this.output = [payload];
    this.end();
  }
}
