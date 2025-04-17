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

  @SubscribeMessage('debug')
  handleMessage3(client: GameSocket, payload: any) {
    console.log('player: ', client.data.player);
    console.log('context: ', client.data.context['players']);
    return 'Debug message received';
  }

  handleConnection(client: Socket) {
    const gameId = client.handshake.query.gameId as string; //TODO add validation
    const tempUserId = client.handshake.query.tempUserId as string; //TODO to remove, just for testing
    this.gameService.connectPlayer({ id: tempUserId || '123' }, gameId, client);
    console.log('Client ' + client.id + ' connected to game ' + gameId);
  }

  handleDisconnect(client: GameSocket) {
    //TODO: Handle disconnect
    console.log('Client disconnected:', client.id);
  }
}
