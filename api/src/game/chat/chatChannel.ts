import { WsException } from '@nestjs/websockets';
import { GameContext } from '../classes/GameContext';
import { Player } from '../classes/Player';
import {
  SERVER_SOCKET_EVENTS,
  ServerSocketEvent,
  ServerSocketEventPayloads,
} from '../classes/types';
import { EventHandler } from '../events/eventHandler';
import {
  ChannelOptions,
  ChannelSubscription,
  IncomingMessage,
  OutgoingMessage,
  SubscriptionType,
} from './chat.types';

export abstract class ChatChannel extends EventHandler {
  protected subscribers: Map<string, ChannelSubscription> = new Map();
  private isActive: boolean = false;

  constructor(
    context: GameContext,
    protected options?: ChannelOptions,
  ) {
    super(context);
  }

  abstract get name(): string;

  /**
   * Subscribe a player to the channel.
   * @param player The player to subscribe.
   *
   */
  public subscribe(
    player: Player,
    subscriptionType: SubscriptionType = SubscriptionType.READ_WRITE,
  ): void {
    if (this.subscribers.has(player.id)) {
      this.context.loggerService.warn(
        `ChatChannel:subscribe - Player ${player.id} is already subscribed to channel ${this.name}`,
      );
      return;
    }
    const subscription: ChannelSubscription = {
      player,
      channel: this,
      subscriptionType,
    };
    this.subscribers.set(player.id, subscription);
    player.channels.set(this.name, subscription);

    this.sendMessageToPlayer(player, {
      type: 'system_message',
      content: `You have joined the ${this.name} channel.`,
    });
  }
  /**
   * Unsubscribe a player from the channel.
   * @param player The player to unsubscribe.
   */
  public unsubscribe(player: Player): void {
    if (!this.subscribers.has(player.id)) {
      return;
    }
    this.subscribers.delete(player.id);
    player.channels.delete(this.name);

    this.sendMessageToPlayer(player, {
      type: 'system_message',
      content: `You have left the ${this.name} channel.`,
    });
  }

  brodcast(
    message: OutgoingMessage,
    filter: (player: Player) => boolean = () => true,
  ): void {
    message.channel = this.name;
    this.subscribers.forEach((subscriber) => {
      if (filter(subscriber.player)) {
        this.sendMessageToPlayer(
          subscriber.player,
          this.formatMessage(message, subscriber.player),
        );
      }
    });
  }

  sendMessageToPlayer(player: Player, message: OutgoingMessage): void {
    message.channel = this.name;

    this.context.emitToPlayer(
      player,
      SERVER_SOCKET_EVENTS.chatMessage,
      this.formatMessage(message, player),
    );
  }

  //To be overwritten by subclasses to format messages as needed
  formatMessage(
    message: OutgoingMessage,
    destinationPlayer: Player,
  ): OutgoingMessage {
    return message;
  }

  handleIncomingMessage(message: IncomingMessage): void {
    this.verifyIncomingMessage(message);
    this.brodcast({
      type: 'player_message',
      sender_id: message.sender.id,
      content: message.content,
      channel: this.name,
    });
  }
  public activate(): void {
    this.isActive = true;
    this.broadCastStatus();
  }
  public deactivate(): void {
    this.isActive = false;
    this.broadCastStatus();
  }

  public broadCastStatus(): void {
    this.context.broadcastToPlayers(SERVER_SOCKET_EVENTS.channelStatus, {
      channel: this.name,
      isActive: this.isActive,
    });
  }

  private verifyIncomingMessage(message: IncomingMessage): void {
    if (!this.isActive) throw new WsException('Channel is not active');

    try {
      if (this.options?.IncomingMessageContentSchema) {
        message.content = this.options.IncomingMessageContentSchema.parse(
          message.content,
        );
      }
    } catch (error: any) {
      throw new WsException(`Invalid message: ${error.message}`);
    }
    if (
      this.subscribers.get(message.sender.id)?.subscriptionType !==
      SubscriptionType.READ_WRITE
    ) {
      throw new WsException(
        `Player ${message.sender.id} is subscribed in read-only mode and cannot send messages.`,
      );
    }

    this.validateMessage(message);
  }

  broadcastToSubscribers<E extends ServerSocketEvent>(
    event: E,
    payload: ServerSocketEventPayloads[E],
    filter: (player: Player) => boolean = () => true,
  ) {
    for (const subscription of this.subscribers.values()) {
      if (filter(subscription.player))
        this.context.emitToPlayer(subscription.player, event, payload);
    }
  }

  abstract validateMessage(message: IncomingMessage): void;
}
