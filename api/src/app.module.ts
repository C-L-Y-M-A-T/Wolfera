import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
<<<<<<< HEAD
import { GameModule } from './game/game.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [GameModule, SocketModule],
=======
import { config } from './config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.postgres.host,
      port: config.postgres.port,
      username: config.postgres.user,
      password: config.postgres.password,
      database: config.postgres.dbName,
      synchronize: config.env === 'development',
    }),
  ],
>>>>>>> main
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
