import { GameContext } from 'src/game/classes/GameContext';
import { Player } from 'src/game/classes/Player';
import { OnGameEvent } from 'src/game/events/event-emitter/decorators/game-event.decorator';
import { events } from 'src/game/events/event.types';
import { IncomingMessage, SubscriptionType } from '../chat.types';
import { ChatChannel } from '../chatChannel';
export class GeneralChannel extends ChatChannel {
  constructor(context: GameContext) {
    super(context);
  }

  get name(): string {
    return 'general';
  }

  @OnGameEvent(events.GAME.PLAYER_JOIN)
  onPlayerJoin(player: Player): void {
    this.subscribe(player);
  }

  @OnGameEvent(events.GAME.PLAYER.KILLED)
  onPlayerKilled(player: Player): void {
    const subscriber = this.subscribers.get(player.id);
    if (subscriber) {
      subscriber.subscriptionType = SubscriptionType.READ_ONLY;
    }
  }
  validateMessage(message: IncomingMessage): void {
    return;
  }
}
