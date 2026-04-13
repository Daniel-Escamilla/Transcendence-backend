import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import type {
  LoginPayload,
  RegisterPayload,
  VerifyTokenPayload,
} from '@app/contracts';

import { AuthSubjects } from '../../config';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AuthSubjects.register)
  register(@Payload() payload: RegisterPayload) {
    return this.authService.register(payload);
  }

  @MessagePattern(AuthSubjects.login)
  login(@Payload() payload: LoginPayload) {
    return this.authService.login(payload);
  }

  @MessagePattern(AuthSubjects.verify)
  verify(@Payload() payload: VerifyTokenPayload) {
    return this.authService.verify(payload);
  }

  @MessagePattern(AuthSubjects.health)
  health() {
    return this.authService.health();
  }
}
