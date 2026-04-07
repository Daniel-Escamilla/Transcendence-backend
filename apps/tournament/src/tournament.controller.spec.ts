import { Test, TestingModule } from '@nestjs/testing';
import { TournamentController } from './tournament.controller';
import { TournamentService } from './tournament.service';

describe('TournamentController', () => {
  let tournamentController: TournamentController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TournamentController],
      providers: [TournamentService],
    }).compile();

    tournamentController = app.get<TournamentController>(TournamentController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(tournamentController.getHello()).toBe('Hello World!');
    });
  });
});
