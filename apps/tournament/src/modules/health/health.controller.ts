import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import type { HealthResponse } from '@app/contracts';

import { TournamentSubjects } from '../../config';

@Controller()
export class HealthController {
  @MessagePattern(TournamentSubjects.health)
  check(): HealthResponse {
    return {
      status: 'ok',
      service: 'tournament',
    };
  }
}
