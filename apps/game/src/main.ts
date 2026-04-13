import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('GameMS');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.NATS,
    options: {
      servers: envs.natsServers,
      reconnect: true,
      maxReconnectAttempts: -1,
      reconnectTimeWait: 2000,
      timeout: 5000,
      name: 'ms-game',
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen();
  logger.log(`Game microservice listening on NATS: ${envs.natsServers.join(', ')}`);
}

void bootstrap();
