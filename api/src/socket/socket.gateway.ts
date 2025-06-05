import { Injectable } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameContext } from 'src/game/classes/GameContext';
import { Player } from 'src/game/classes/Player';
import { PlayerAction } from 'src/game/classes/types';
import { GameService } from 'src/game/services/game/game.service';
import { GameSocket } from 'src/socket/socket.types';

import { LoggerService } from 'src/logger/logger.service';
import { User } from 'src/users/entities/user.entity';
import { SocketGame } from './decorators/socketGame.decorator';
import { SocketPlayer } from './decorators/socketPlayer.decorator';
import { JwtSocket } from './jwt-socket';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private gameService: GameService,
    private readonly jwtSocket: JwtSocket,
    private readonly loggerService: LoggerService,
  ) {}

  @SubscribeMessage('player-action')
  async handlePlayerAction(
    @SocketGame() game: GameContext,
    @SocketPlayer() player: Player,
    @MessageBody() payload: PlayerAction,
  ) {
    // TODO: test object payload in ws
    console.log('player-action event received', payload);
    await game.handlePlayerAction(player, payload);
  }

  @SubscribeMessage('start-dummy-game')
  createDummyGame(client: GameSocket, payload: any) {
    this.loggerService.log('start-dummy-game event received');
    const dummyPlayers: User[] = [
      {
        id: '456',
        username: 'Dummy Player 1',
      },
      {
        id: '789',
        username: 'Dummy Player 2',
      },
      {
        id: '101112',
        username: 'Dummy Player 3',
      },
      {
        id: '131415',
        username: 'Dummy Player 4',
      },
    ] as User[];
    dummyPlayers.forEach((player) => {
      client.data.game.addPlayer(player);
    });
    client.data.game.handlePlayerAction(client.data.game.owner, {
      action: 'start-game',
    });
  }

  async handleConnection(client: Socket) {
    try {
      const gameId = client.handshake.query.gameId;

      if (!gameId || typeof gameId !== 'string')
        throw new WsException('Missing or invalid gameId');

      // const user = await this.jwtSocket.authenticate(
      //   client.handshake.query.token as string,
      // );
      const user: User = {
        id: client.handshake.query.userId as string,
        username: client.handshake.query.username || ('Temp User' as string),
        // Add other user properties if needed
      } as User;
      this.gameService.connectPlayer(user, gameId, client);
      console.log('Client ' + client.id + ' connected to game ' + gameId);
    } catch (error) {
      client.emit('error', {
        message: error.message || 'An error occurred during connection',
      });
      client.disconnect();
    }
  }

  handleDisconnect(client: GameSocket) {
    //TODO: Handle disconnect
    this.loggerService.log('Client disconnected:', client.id);
  }
}
