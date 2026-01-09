import { Test, TestingModule } from '@nestjs/testing';
import { FootballFormatController } from './format.controller';
import { MatchFormatService } from './format.service';
import { AuthGuard } from '../../auth/auth.guard';
import { RolesGuard } from '../../users/roles.guard';

describe('FootballFormatController', () => {
  let controller: FootballFormatController;
  let service: MatchFormatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FootballFormatController],
      providers: [
        {
          provide: MatchFormatService,
          useValue: {
            _create: jest.fn(),
            _find: jest.fn(),
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

    controller = module.get<FootballFormatController>(FootballFormatController);
    service = module.get<MatchFormatService>(MatchFormatService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
