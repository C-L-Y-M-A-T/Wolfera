import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './config';
import { swagger } from './utils/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'https://rnsyl-197-30-220-62.a.free.pinggy.link',
      'http://localhost:1234',
    ],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      validateCustomDecorators: true,
      stopAtFirstError: true,
    }),
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });
  swagger(app);
  await app.listen(config.apiPort);
}
bootstrap();
