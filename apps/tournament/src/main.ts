import { NestFactory } from '@nestjs/core';
import { TournamentModule } from './tournament.module';

async function bootstrap() {
  const app = await NestFactory.create(TournamentModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
