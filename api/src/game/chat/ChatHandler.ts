import { GameContext } from '../classes/GameContext';
import { IncomingMessage } from './chat.types';
import { ChatChannel } from './chatChannel';
import { DeadChannel } from './dead/dead.channel';
import { GeneralChannel } from './general/general.channel';
import { WerewolfChannel } from './werewolf/werewolf.channel';

export class ChatHandler {
  private channels: Map<string, ChatChannel> = new Map();

  constructor(private context: GameContext) {
    this.initializeChannels();
  }
  initializeChannels() {
    const channels: ChatChannel[] = [
      new GeneralChannel(this.context),
      new DeadChannel(this.context),
      new WerewolfChannel(this.context),
    ];

    channels.forEach((channel) => {
      this.channels.set(channel.name, channel);
    });
  }

  handleIncomingMessage(message: IncomingMessage) {
    const channel = this.channels.get(message.channel);
    if (channel) {
      channel.handleIncomingMessage(message);
    } else {
      console.error(`Channel ${message.channel} not found`);
    }
  }
}
