import { Test, TestingModule } from '@nestjs/testing';
import { FootballEventController } from './events.controller';
import { MatchEventService } from './events.service';
import { AuthGuard } from '../../auth/auth.guard';
import { RolesGuard } from '../../users/roles.guard';

describe('FootballEventController', () => {
  let controller: FootballEventController;
  let service: MatchEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FootballEventController],
      providers: [
        {
          provide: MatchEventService,
          useValue: {
            findByMatch: jest.fn().mockResolvedValue([]),
            _create: jest.fn(),
            _patch: jest.fn(),
            _remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<FootballEventController>(FootballEventController);
    service = module.get<MatchEventService>(MatchEventService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
