import { GameContext } from 'src/game/classes/GameContext';
import { Player } from 'src/game/classes/Player';
import { IncomingMessage } from '../chat.types';
import { ChatChannel } from '../chatChannel';

export class GeneralChannel extends ChatChannel {
  constructor(context: GameContext) {
    super(context);
    context.gameEventEmitter.on('player:join', (player: Player) => {
      this.onPlayerJoin(player);
    });
  }

  get name(): string {
    return 'general';
  }

  onPlayerJoin(player: Player): void {
    this.subscribe(player);
    this.sendMessageToPlayer(player, {
      type: 'system_message',
      content: `Welcome to the game! You can chat here.`,
      channel: this.name,
    });
  }

  playerCanSendMessage(player: Player, message: IncomingMessage): boolean {
    return player.isAlive;
  }
}
