import { Module } from '@nestjs/common';
import { GameModule } from 'src/game/game.module';
import { UserModule } from 'src/users/user.module';
import { JwtSocket } from './jwt-socket';
import { SocketGateway } from './socket.gateway';

@Module({
  imports: [GameModule, UserModule],
  providers: [SocketGateway, JwtSocket],
})
export class SocketModule {}
