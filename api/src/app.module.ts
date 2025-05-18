import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { config } from './config';
import { GameModule } from './game/game.module';
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
      type: 'postgres',
      host: config.postgres.host,
      port: config.postgres.port,
      username: config.postgres.user,
      password: config.postgres.password,
      database: config.postgres.dbName,
      synchronize: config.env === 'development',
      autoLoadEntities: true,
    }),
    GameModule,
    SocketModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
