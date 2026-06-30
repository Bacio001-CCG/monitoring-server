import { Test, TestingModule } from '@nestjs/testing';
import { MetricsService } from './metrics.service';
import { MetricsRepository } from './repositories/metrics.repository';

describe('MetricsService', () => {
  let service: MetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsService,
        {
          provide: MetricsRepository,
          useValue: {
            findHostByFingerprint: jest.fn(),
            saveHost: jest.fn(),
            saveSnapshot: jest.fn(),
            findRecentSnapshots: jest.fn(),
            findAllHosts: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MetricsService>(MetricsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
