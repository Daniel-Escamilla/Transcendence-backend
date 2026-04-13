import { Module } from '@nestjs/common';

import { NatsModule } from '../../transports/nats.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [NatsModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
