import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from './prisma/prisma.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback_secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [UserService, PrismaService, JwtStrategy],
  exports: [UserService],

  controllers: [UserController],
})
export class UserModule {}
