import { Injectable } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameService } from 'src/game/services/game/game.service';
import { GameSocket } from 'src/socket/socket.types';
import { User } from 'src/temp/temp.user';
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

  @SubscribeMessage('start-game')
  startGame(client: GameSocket, payload: any) {
    //TODO: add interceptor to exctract game and player from client (same in websocket)
    console.log('start-game', payload);
    //client.data.game.start();
  }

  @SubscribeMessage('player-action')
  handlePlayerAction(client: GameSocket, payload: any) {
    //TODO: read and validate player action
    const tempPlayerAction = {
      personToKill: 'sallemi',
    };
    client.data.game.handlePlayerAction(client.data.player, tempPlayerAction);
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
    const gameId = client.handshake.query.gameId as string; //TODO add validation

    const user = await this.jwtSocket.authenticate(
      client.handshake.query.token as string,
    );
    this.gameService.connectPlayer(user, gameId, client);
    console.log('Client ' + client.id + ' connected to game ' + gameId);
  }

  handleDisconnect(client: GameSocket) {
    //TODO: Handle disconnect
    console.log('Client disconnected:', client.id);
  }
}
