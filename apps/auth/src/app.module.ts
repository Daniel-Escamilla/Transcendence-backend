import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { DatabaseModule } from '@app/database';

import { envs } from './config';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: envs.jwtSecret,
      signOptions: { expiresIn: envs.jwtExpiresIn as any },
    }),
    AuthModule,
  ],
})
export class AppModule {}
