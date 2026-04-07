import { Controller, Get } from '@nestjs/common';
import { TournamentService } from './tournament.service';

@Controller()
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Get()
  getHello(): string {
    return this.tournamentService.getHello();
  }
}
