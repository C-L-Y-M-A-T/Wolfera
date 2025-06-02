import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'src/config';
import { GameModule } from 'src/game/modules/game.module';
import { UserModule } from 'src/users/user.module';
import { JwtSocket } from './jwt-socket';
import { SocketGateway } from './socket.gateway';

@Module({
  imports: [
    GameModule,
    UserModule,
    JwtModule.register({
      secret: config.jwt.secret,
      signOptions: { expiresIn: config.jwt.expirationTime },
    }),
  ],
  providers: [SocketGateway, JwtSocket],
})
export class SocketModule {}
