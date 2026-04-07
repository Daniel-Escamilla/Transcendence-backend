import { Injectable } from '@nestjs/common';

@Injectable()
export class TournamentService {
  getHello(): string {
    return 'Hello World!';
  }
}
