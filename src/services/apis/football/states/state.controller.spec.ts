import { Test, TestingModule } from '@nestjs/testing';
import { FootballStateController } from './state.controller';
import { MatchStateService } from './state.service';
import { AuthGuard } from '../../auth/auth.guard';
import { RolesGuard } from '../../users/roles.guard';

describe('FootballStateController', () => {
  let controller: FootballStateController;
  let service: MatchStateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FootballStateController],
      providers: [
        {
          provide: MatchStateService,
          useValue: {
            _create: jest.fn(),
            _get: jest.fn(),
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

    controller = module.get<FootballStateController>(FootballStateController);
    service = module.get<MatchStateService>(MatchStateService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
