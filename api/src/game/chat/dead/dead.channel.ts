import { GameContext } from 'src/game/classes/GameContext';
import { Player } from 'src/game/classes/Player';
import { IncomingMessage } from '../chat.types';
import { ChatChannel } from '../chatChannel';

export class DeadChannel extends ChatChannel {
  constructor(context: GameContext) {
    super(context);
    context.gameEventEmitter.on('player:die', (player: Player) => {
      this.onPlayerDie(player);
    });
  }

  get name(): string {
    return 'dead';
  }

  onPlayerDie(player: Player): void {
    this.subscribe(player);
    this.sendMessageToPlayer(player, {
      type: 'system_message',
      content: `You are dead. You can chat here.`,
      channel: this.name,
    });
  }

  playerCanSendMessage(player: Player, message: IncomingMessage): boolean {
    return true;
  }
}
