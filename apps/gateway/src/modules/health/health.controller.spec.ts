import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('returns gateway health', () => {
    const controller = new HealthController();

    expect(controller.check()).toEqual({
      status: 'ok',
      service: 'gateway',
    });
  });
});
