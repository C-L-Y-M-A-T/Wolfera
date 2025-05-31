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
import { GameService } from 'src/game/services/game/game.service';
import { PlayerAction } from 'src/roles';
import { GameSocket } from 'src/socket/socket.types';
import { User } from 'src/temp/temp.user';
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
  ) {}

  @SubscribeMessage('player-action')
  handlePlayerAction(
    @SocketGame() game: GameContext,
    @SocketPlayer() player: Player,
    @MessageBody() payload: PlayerAction,
  ) {
    // TODO: test object payload in ws
    console.log('player-action event received', payload);
    game.handlePlayerAction(player, payload);
  }

  @SubscribeMessage('start-dummy-game')
  createDummyGame(client: GameSocket, payload: any) {
    console.log('start-dummy-game event received');
    const dummyPlayers: User[] = [
      {
        id: '456',
      },
      {
        id: '789',
      },
      {
        id: '101112',
      },
      {
        id: '131415',
      },
    ];
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

      const user = await this.jwtSocket.authenticate(
        client.handshake.query.token as string,
      );
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
    console.log('Client disconnected:', client.id);
  }
}
