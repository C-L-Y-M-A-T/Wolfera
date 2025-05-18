import { GameContext } from '../classes/GameContext';
import { Player } from '../classes/Player';
import { IncomingMessage, OutgoingMessage } from './chat.types';

export abstract class ChatChannel {
  protected context: GameContext;
  private subscribers: Player[] = [];
  private isActive: boolean = false;

  constructor(context: GameContext) {
    this.context = context;
  }
  abstract get name(): string;

  public subscribe(player: Player): void {
    this.subscribers.push(player);
    this.sendMessageToPlayer(player, {
      type: 'system_message',
      content: `You have joined the ${this.name} channel.`,
    });
  }
  public unsubscribe(player: Player): void {
    this.subscribers = this.subscribers.filter((p) => p !== player);
  }

  brodcast(
    message: OutgoingMessage,
    filter: (player: Player) => boolean = () => true,
  ): void {
    message.channel = this.name;
    this.subscribers.filter(filter).forEach((player) => {
      this.sendMessageToPlayer(player, message);
    });
  }

  sendMessageToPlayer(player: Player, message: OutgoingMessage): void {
    message.channel = this.name;
    if (!player.isConnected()) {
      console.error(`Player ${player.id} is not connected`);
      return;
    }
    player.socket.emit('chat-message', this.formatMessage(message, player));
  }

  //To be overwritten by subclasses
  formatMessage(
    message: OutgoingMessage,
    destinationPlayer: Player,
  ): OutgoingMessage {
    return message;
  }

  handleIncomingMessage(message: IncomingMessage): void {
    if (this.verifyIncomingMessage(message)) {
      this.brodcast({
        type: 'player_message',
        sender_id: message.sender.id,
        content: message.content,
        channel: this.name,
      });
    }
  }
  public activate(): void {
    this.isActive = true;
    this.context.gameEventEmitter.emit(
      `chat:channel:${this.name}:activate`,
      this,
    );
  }
  public deactivate(): void {
    this.isActive = false;
    this.context.gameEventEmitter.emit(
      `chat:channel:${this.name}:deactivate`,
      this,
    );
  }

  private verifyIncomingMessage(message: IncomingMessage): boolean {
    return (
      this.isActive &&
      this.subscribers.includes(message.sender) &&
      this.playerCanSendMessage(message.sender, message) &&
      this.validateIncomingMessageFormat(message) &&
      this.validateMessageContent(message)
    );
  }

  // to be overridden by subclasses to provide specific validation logic
  validateMessageContent(message: IncomingMessage): boolean {
    return true;
  }

  private validateIncomingMessageFormat(message: IncomingMessage): boolean {
    // Implement your validation logic here
    return true;
  }

  playerCanSendMessage(player: Player, message: IncomingMessage): boolean {
    return true;
  }
}
