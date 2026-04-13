import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

import type { AuthenticatedRequestContext, AuthenticatedRequestEnvelope, PublicUser } from '@app/contracts';

import { envs, NATS_SERVICE, UserSubjects } from '../../config';

@Injectable()
export class UsersService {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  async me(user: AuthenticatedRequestContext): Promise<PublicUser> {
    const payload: AuthenticatedRequestEnvelope<Record<string, never>> = {
      context: user,
      data: {},
    };

    const observable = this.client.send<PublicUser>(UserSubjects.me, payload).pipe(
      timeout(envs.requestTimeoutMs),
      catchError((error) => {
        throw new RpcException(error);
      }),
    );

    return firstValueFrom(observable);
  }
}
