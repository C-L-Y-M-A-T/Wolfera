import { Socket } from 'socket.io';
import { GameContext } from 'src/game/classes/GameContext';
import { Player } from 'src/game/classes/Player';

export interface GameSocket extends Socket {
  data: {
    context: GameContext;
    player: Player;
  };
}
