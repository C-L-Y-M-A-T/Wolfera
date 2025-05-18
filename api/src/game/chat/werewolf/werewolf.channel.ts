import { GameContext } from 'src/game/classes/GameContext';
import { Player } from 'src/game/classes/Player';
import werewolfRole from 'src/roles/werewolf';
import { IncomingMessage } from '../chat.types';
import { ChatChannel } from '../ChatChannel';

export class WerewolfChannel extends ChatChannel {
  constructor(context: GameContext) {
    super(context);
    context.gameEventEmitter.on('player:join', (player: Player) => {
      this.onPlayerJoin(player);
    });
  }

  get name(): string {
    return 'werewolf';
  }

  onPlayerJoin(player: Player): void {
    if (player.role?.roleData.name === werewolfRole.roleData.name) {
      this.subscribe(player);
      this.sendMessageToPlayer(player, {
        type: 'system_message',
        content: `Welcome to the Werewolf channel! You can chat here.`,
        channel: this.name,
      });
    }
  }

  playerCanSendMessage(player: Player, message: IncomingMessage): boolean {
    return true;
  }
}
