import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import type { HealthResponse } from '@app/contracts';

import { GameSubjects } from '../../config';

@Controller()
export class HealthController {
  @MessagePattern(GameSubjects.health)
  check(): HealthResponse {
    return {
      status: 'ok',
      service: 'game',
    };
  }
}
