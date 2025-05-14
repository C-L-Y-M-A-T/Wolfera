import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Player } from 'src/game/classes/Player';
import { GameSocket } from 'src/socket/socket.types';

export const SocketPlayer = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Player => {
    const client: GameSocket = ctx.switchToWs().getClient();
    if (!client.data.player) {
      throw new WsException('Player is not in a valid game session');
    }
    return client.data.player;
  },
);
