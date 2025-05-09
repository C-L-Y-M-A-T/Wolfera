import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './config';
import { swagger } from './utils/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: config.corsOrigin,
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
