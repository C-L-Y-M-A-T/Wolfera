import { Player } from 'src/game/classes/Player';
import { OnGameEvent } from 'src/game/events/event-emitter/decorators/game-event.decorator';
import { events } from 'src/game/events/event.types';
import { IncomingMessage } from '../chat.types';
import { ChatChannel } from '../chatChannel';

export class DeadChannel extends ChatChannel {
  get name(): string {
    return 'dead';
  }
  validateMessage(message: IncomingMessage): void {}

  @OnGameEvent(events.GAME.PLAYER.KILLED)
  onPlayerDie(player: Player): void {
    this.subscribe(player);
    this.sendMessageToPlayer(player, {
      type: 'system_message',
      content: `You are dead. You can chat here.`,
      channel: this.name,
    });
  }
}
