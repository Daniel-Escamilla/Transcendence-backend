import { Test, TestingModule } from '@nestjs/testing';

import { HealthController } from '../src/modules/health/health.controller';

describe('Gateway HTTP (integration)', () => {
  let moduleFixture: TestingModule;

  beforeEach(async () => {
    process.env.NATS_SERVERS = process.env.NATS_SERVERS ?? 'nats://localhost:4222';

    const { AppModule } = await import('../src/app.module');
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('resolves the health controller from the app module', () => {
    const controller = moduleFixture.get(HealthController);

    expect(controller.check()).toEqual({
      status: 'ok',
      service: 'gateway',
    });
  });
});
