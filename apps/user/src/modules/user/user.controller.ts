import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import type { AuthenticatedRequestEnvelope } from '@app/contracts';

import { UserSubjects } from '../../config';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(UserSubjects.me)
  me(@Payload() payload: AuthenticatedRequestEnvelope<Record<string, never>>) {
    return this.userService.me(payload);
  }

  @MessagePattern(UserSubjects.health)
  health() {
    return this.userService.health();
  }
}
