import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import type {
  AuthenticatedRequestEnvelope,
  HealthResponse,
  PublicUser,
} from '@app/contracts';
import { PrismaService } from '@app/database';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async me(
    payload: AuthenticatedRequestEnvelope<Record<string, never>>,
  ): Promise<PublicUser> {
    if (!payload?.context?.userId) {
      throw new RpcException({ status: 400, message: 'Authenticated context is required' });
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.context.userId },
    });

    if (!user) {
      throw new RpcException({ status: 404, message: 'User not found' });
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fortytwoId: user.fortytwoId,
    };
  }

  health(): HealthResponse {
    return {
      status: 'ok',
      service: 'user',
    };
  }
}
