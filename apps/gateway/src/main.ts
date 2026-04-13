import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { RpcToHttpExceptionFilter } from './common/exceptions/rpc-to-http.filter';
import { AppModule } from './app.module';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('Gateway');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new RpcToHttpExceptionFilter());

  await app.listen(envs.port);
  logger.log(`Gateway listening on port ${envs.port}`);
}

void bootstrap();
