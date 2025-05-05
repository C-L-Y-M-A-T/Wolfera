import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { GameContext } from 'src/game/classes/GameContext';
import { GameSocket } from 'src/socket/socket.types';

export const SocketGame = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): GameContext => {
    const client: GameSocket = ctx.switchToWs().getClient();
    if (!client.data.game) {
      throw new WsException('The game is not valid');
    }
    return client.data.game;
  },
);
