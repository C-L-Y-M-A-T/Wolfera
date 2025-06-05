import { z } from 'zod';
import { Player } from '../classes/Player';
import { ChatChannel } from './chatChannel';

export const IncomingMessageSchema = z.object({
  sender: z.instanceof(Player),
  content: z.any(),
  channel: z.string(),
});

export type IncomingMessage = z.infer<typeof IncomingMessageSchema>;

type BaseOutgoingMessage = {
  type: string;
  content: string;
  channel?: string;
};

export type OutgoingPlayerMessage = BaseOutgoingMessage & {
  sender_id: string;
  type: 'player_message';
};

export type OutgoingSystemMessage = BaseOutgoingMessage & {
  type: 'system_message';
};

export type OutgoingMessage = OutgoingPlayerMessage | OutgoingSystemMessage;

export enum SubscriptionType {
  READ_WRITE, // Can send and receive messages
  READ_ONLY, // Can only receive messages
}

export interface ChannelSubscription {
  player: Player;
  channel: ChatChannel;
  subscriptionType: SubscriptionType;
}

export type ChannelOptions = {
  IncomingMessageContentSchema?: z.ZodSchema;
};

export type ChannelStatus = {
  channel: string;
  isActive: boolean;
};
