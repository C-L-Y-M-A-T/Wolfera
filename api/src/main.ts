import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { config } from './config';

async function bootstrap() {
  const FRONT_URL: string = config.uiBaseUrl;
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: FRONT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  app.use(cookieParser());

  await app.listen(config.apiPort);
}

bootstrap();
