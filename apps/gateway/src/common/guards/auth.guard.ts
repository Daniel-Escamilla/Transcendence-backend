import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';

import type { VerifyTokenResponse } from '@app/contracts';

import { AuthSubjects, envs, NATS_SERVICE } from '../../config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request.headers?.authorization);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    const response = await this.verifyToken(token);
    request.user = response.user;

    return true;
  }

  private async verifyToken(token: string): Promise<VerifyTokenResponse> {
    try {
      const response = await firstValueFrom(
        this.client
          .send<VerifyTokenResponse>(AuthSubjects.verify, { token })
          .pipe(timeout(envs.requestTimeoutMs)),
      );

      if (!response?.user) {
        throw new UnauthorizedException('Invalid token');
      }

      return response;
    } catch (error) {
      const message =
        typeof error === 'object' && error !== null && 'message' in error
          ? ((error as { message?: string }).message ?? 'Invalid token')
          : 'Invalid token';

      throw new UnauthorizedException(message);
    }
  }

  private extractToken(authorization?: string): string | undefined {
    const [scheme, value] = authorization?.split(' ') ?? [];

    if (scheme?.toLowerCase() !== 'bearer') {
      return undefined;
    }

    return value;
  }
}
