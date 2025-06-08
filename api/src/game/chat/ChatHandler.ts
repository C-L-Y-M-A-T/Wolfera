import { WsException } from '@nestjs/websockets';
import { GameContext } from '../classes/GameContext';
import { Player } from '../classes/Player';
import {
  IncomingMessage,
  RawIncomingMessage,
  RawIncomingMessageSchema,
} from './chat.types';
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

  handleIncomingMessage(player: Player, rawMessage: RawIncomingMessage) {
    const parseResult = RawIncomingMessageSchema.safeParse(rawMessage);
    if (!parseResult.success) {
      throw new WsException(
        `Invalid message format: ${parseResult.error.message}`,
      );
    }
    const message: IncomingMessage = { ...parseResult.data, sender: player };

    const channel = this.channels.get(message.channel);
    if (channel) {
      channel.handleIncomingMessage(message);
    } else {
      throw new WsException(`Channel ${message.channel} does not exist.`);
    }
  }
}
