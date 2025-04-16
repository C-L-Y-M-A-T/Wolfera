import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { config } from './config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.cwd() + '/../.env',
      load: [() => config],
    }),
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
