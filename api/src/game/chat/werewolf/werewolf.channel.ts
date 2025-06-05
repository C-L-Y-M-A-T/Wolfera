import { Player } from 'src/game/classes/Player';
import { PHASE_NAMES } from 'src/game/classes/types';
import { OnGameEvent } from 'src/game/events/event-emitter/decorators/game-event.decorator';
import { events } from 'src/game/events/event.types';
import { RoleAssignmentPhase } from 'src/game/phases/roleAssignmentPhase/roleAssignment.phase';
import werewolfRole from 'src/roles/werewolf';
import { IncomingMessage, SubscriptionType } from '../chat.types';
import { ChatChannel } from '../chatChannel';

export class WerewolfChannel extends ChatChannel {
  get name(): string {
    return 'werewolf';
  }

  validateMessage(message: IncomingMessage): void {}

  @OnGameEvent(events.GAME.PHASE.END(PHASE_NAMES.ROLE_ASSIGNMENT))
  onRoleAssignment(roleAssignmentPhase: RoleAssignmentPhase): void {
    for (const player of this.context.players.values()) {
      if (player.role?.roleData.name === werewolfRole.roleData.name) {
        this.subscribe(player);
        this.sendMessageToPlayer(player, {
          type: 'system_message',
          content: `Welcome to the Werewolf channel! You can chat here.`,
          channel: this.name,
        });
      }
      //TODO: add petiteFille Read only subscription
    }
  }

  @OnGameEvent(events.GAME.PLAYER.KILLED)
  onPlayerKilled(player: Player): void {
    const subscriber = this.subscribers.get(player.id);
    if (subscriber) {
      subscriber.subscriptionType = SubscriptionType.READ_ONLY;
    }
  }
}
