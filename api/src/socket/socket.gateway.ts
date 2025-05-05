import { Injectable } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameContext } from 'src/game/classes/GameContext';
import { GameService } from 'src/game/services/game/game.service';
import { GameSocket } from 'src/socket/socket.types';
import { User } from 'src/temp/temp.user';
import { SocketGame } from './decorators/socketGame.decorator';
import { Player } from 'src/game/classes/Player';
import { SocketPlayer } from './decorators/socketPlayer.decorator';

//TODO: requqire authentication
@Injectable()
@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private gameService: GameService) {}

  @SubscribeMessage('start-game')
  startGame(@SocketGame() game: GameContext, payload: any) {
    console.log('start-game', payload);
    //game.start();
    //client.data.game.start();
  }

  @SubscribeMessage('player-action')
  handlePlayerAction(
    @SocketGame() game: GameContext,
    @SocketPlayer() player: Player,
    payload: any,
  ) {
    //TODO: read and validate player action
    const tempPlayerAction = {
      personToKill: 'sallemi',
    };
    game.handlePlayerAction(player, tempPlayerAction);
  }

  @SubscribeMessage('start-dummy-game')
  createDummyGame(@SocketGame() game: GameContext, payload: any) {
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
      game.addPlayer(player);
    });
    game.handlePlayerAction(game.owner, {
      action: 'start-game',
    });
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
