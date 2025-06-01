// src/roles/werewolf/night-action.ts

import { GameContext } from 'src/game/classes/GameContext';
import { RolePhase } from 'src/game/classes/phases/rolePhase/role.phase';
import { Player } from 'src/game/classes/Player';
import werewolfRole, { WerewolfAction } from '.';

export class WerewolfNightPhase extends RolePhase<WerewolfAction> {
  constructor(context: GameContext) {
    super(context, werewolfRole);
  }
  get phaseDuration(): number {
    return 0;
  }

  validatePlayerAction(player: Player, action: any): action is WerewolfAction {
    // Validate:
    // 1. Player is a werewolf
    // 2. Target is valid (alive, not another werewolf)

    return true;
  }

  async onStart() {
    // Notify werewolves it's their turn

    // todo: implement emit to role/ emit to players under a certain condition like has or has not role
    this.context.emit('werewolf:night:start', {
      message: 'Choose a victim...',
    });
    this.context.loggerService.log('Werewolf night phase started');
  }
  async onEnd() {
    // Notify werewolves the night phase is over
    this.context.emit('werewolf:night:end', {
      message: 'Night phase is over.',
    });
    this.context.loggerService.log('Werewolf night phase ended');
  }

  async processPlayerAction(player: Player, action: WerewolfAction) {
    // Register the werewolf's kill vote
    //this.context.addNightAction('kill', action.targetId);
    this.context.loggerService.log(
      `Werewolf ${player.profile.id} chose to kill ${action.personToKill}`,
    );
    this.output = [action];
    this.end();
  }
}
