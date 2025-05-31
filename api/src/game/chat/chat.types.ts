import { Player } from '../classes/Player';

export type IncomingMessage = {
  sender: Player;
  content: any;
  channel: string;
};

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
