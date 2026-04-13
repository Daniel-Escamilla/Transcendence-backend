import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

import type { LoginPayload, LoginResponse, PublicUser, RegisterPayload } from '@app/contracts';

import { AuthSubjects, envs, NATS_SERVICE } from '../../config';

@Injectable()
export class AuthService {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  register(payload: RegisterPayload): Promise<PublicUser> {
    return this.send<PublicUser>(AuthSubjects.register, payload);
  }

  login(payload: LoginPayload): Promise<LoginResponse> {
    return this.send<LoginResponse>(AuthSubjects.login, payload);
  }

  private async send<T>(subject: string, payload: unknown): Promise<T> {
    const observable = this.client.send<T>(subject, payload).pipe(
      timeout(envs.requestTimeoutMs),
      catchError((error) => {
        throw new RpcException(error);
      }),
    );

    return firstValueFrom(observable);
  }
}
