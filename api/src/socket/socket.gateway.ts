import { Injectable } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameService } from 'src/game/services/game.service';
import { GameSocket } from 'src/socket/socket.types';

//TODO: requqire authentication
@Injectable()
@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private gameService: GameService) {}

  @SubscribeMessage('start-game')
  startGame(client: GameSocket, payload: any) {
    //TODO: add interceptor to exctract game and player from client (same in websocket)
    console.log('start-game', payload);
    client.data.game.start();
  }

  handleConnection(client: Socket) {
    const gameId = client.handshake.query.gameId as string; //TODO add validation
    const tempUserId = client.handshake.query.tempUserId as string; //TODO to remove, just for testing. get user from auth
    this.gameService.connectPlayer({ id: tempUserId || '123' }, gameId, client);
    console.log('Client ' + client.id + ' connected to game ' + gameId);
  }

  handleDisconnect(client: GameSocket) {
    //TODO: Handle disconnect
    console.log('Client disconnected:', client.id);
  }
}
