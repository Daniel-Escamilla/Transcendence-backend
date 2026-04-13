import { Module } from '@nestjs/common';

import { DatabaseModule } from '@app/database';

import { UserModule } from './modules/user/user.module';

@Module({
  imports: [DatabaseModule, UserModule],
})
export class AppModule {}
