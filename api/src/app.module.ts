import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtGuard } from './auth/guards/jwt.guard';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { config } from './config';
import { GameModule } from './game/modules/game.module';
import { NotificationModule } from './notifications/notifications.module';
import { SocketModule } from './socket/socket.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/users/graphql/schema.gql'),
      sortSchema: true,
      context: ({ req }) => ({ req, user: req.user || undefined }),
    }),
    TypeOrmModule.forRoot({
      type: config.dbType,
      host: config.db.host,
      port: config.db.port,
      username: config.db.user,
      password: config.db.password,
      database: config.db.dbName,
      synchronize: config.env === 'development',
      autoLoadEntities: true,
      logging: true,
    }),
    GameModule,
    SocketModule,
    AuthModule,
    UserModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule {}
