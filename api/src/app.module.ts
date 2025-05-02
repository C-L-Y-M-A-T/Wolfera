import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [GameModule, SocketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
