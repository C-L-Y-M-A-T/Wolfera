// src/roles/werewolf/night-action.ts

import { GamePhase } from 'src/game/classes/GamePhase';
import { Player } from 'src/game/classes/Player';
import { WerewolfAction } from '.';

//TODO: consider creating a base class for night actions if they share common logic
export class WerewolfNightPhase extends GamePhase<WerewolfAction> {
  readonly phaseName = 'werewolf-night';

  get phaseDuration(): number {
    return 0;
  }

  validatePlayerAction(player: Player, action: any): action is WerewolfAction {
    // Validate:
    // 1. Player is a werewolf
    // 2. Target is valid (alive, not another werewolf)
    /*if (player.role.id !== 'werewolf') {
      throw new Error('Only werewolves can perform this action.');
    }
    if (!this.context.isPlayerAlive(action.targetId)) {
      throw new Error('Target is already dead.');
    }*/
    return true;
  }

  async onStart() {
    // Notify werewolves it's their turn
    /*this.context.emitToRole('werewolf', 'night:start', {
      message: 'Choose a victim...',
      alivePlayers: this.context.getAlivePlayers(),
    });*/
    // todo: implement emit to role/ emit to players under a certain condition like has or has not role
    this.context.emmit('werewolf:night:start', {
      message: 'Choose a victim...',
      alivePlayers: this.context.getAlivePlayers(),
    });
    console.log('Werewolf night phase started');
  }
  async onEnd() {
    // Notify werewolves the night phase is over
    this.context.emmit('werewolf:night:end', {
      message: 'Night phase is over.',
    });
    console.log('Werewolf night phase ended');
  }

  async processPlayerAction(player: Player, action: WerewolfAction) {
    // Register the werewolf's kill vote
    //this.context.addNightAction('kill', action.targetId);
    console.log(
      `Werewolf ${player.profile.id} chose to kill ${action.personToKill}`,
    );
    this.output = [action];
    this.end();
  }
}
