import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';

import type {
  HealthResponse,
  LoginPayload,
  LoginResponse,
  PublicUser,
  RegisterPayload,
  VerifyTokenPayload,
  VerifyTokenResponse,
} from '@app/contracts';
import { PrismaService } from '@app/database';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(payload: RegisterPayload): Promise<PublicUser> {
    try {
      const hashedPassword = await bcrypt.hash(payload.password, 10);
      const user = await this.prisma.user.create({
        data: {
          username: payload.username,
          email: payload.email,
          password: hashedPassword,
        },
      });

      return this.toPublicUser(user);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async login(payload: LoginPayload): Promise<LoginResponse> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: payload.email },
      });

      if (!user) {
        throw new RpcException({ status: 401, message: 'Invalid credentials' });
      }

      const isValid = await bcrypt.compare(payload.password, user.password);

      if (!isValid) {
        throw new RpcException({ status: 401, message: 'Invalid credentials' });
      }

      const accessToken = await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
      });

      return {
        accessToken,
        user: this.toPublicUser(user),
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verify(payload: VerifyTokenPayload): Promise<VerifyTokenResponse> {
    try {
      const decoded = await this.jwtService.verifyAsync<{
        sub: number;
        email: string;
      }>(payload.token);

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
      });

      if (!user) {
        throw new RpcException({ status: 404, message: 'User not found' });
      }

      return {
        user: {
          userId: user.id,
          email: user.email,
        },
      };
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }

      this.logger.warn(`JWT verification failed: ${(error as Error).message}`);
      throw new RpcException({ status: 401, message: 'Invalid token' });
    }
  }

  health(): HealthResponse {
    return {
      status: 'ok',
      service: 'auth',
    };
  }

  private toPublicUser(user: {
    id: number;
    username: string;
    email: string;
    fortytwoId: string | null;
  }): PublicUser {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fortytwoId: user.fortytwoId,
    };
  }

  private handleError(error: unknown): RpcException {
    if (error instanceof RpcException) {
      return error;
    }

    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
      return new RpcException({ status: 409, message: 'Email already exists' });
    }

    this.logger.error('Auth service error', error instanceof Error ? error.stack : undefined);
    return new RpcException({ status: 500, message: 'Internal server error' });
  }
}
