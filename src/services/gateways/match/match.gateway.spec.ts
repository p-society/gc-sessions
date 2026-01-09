import { Test, TestingModule } from '@nestjs/testing';
import { MatchGateway } from './match.gateway';
import { PresenceGateway } from '../presence/presence.gateway';
import { MatchSocketEvents } from '../constants/match.events';

describe('MatchGateway', () => {
  let gateway: MatchGateway;
  let presenceGateway: PresenceGateway;
  let mockServer: any;

  beforeEach(async () => {
    mockServer = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchGateway,
        {
          provide: PresenceGateway,
          useValue: {
            server: mockServer,
          },
        },
      ],
    }).compile();

    gateway = module.get<MatchGateway>(MatchGateway);
    presenceGateway = module.get<PresenceGateway>(PresenceGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should broadcast match update', () => {
    const payload = {
      matchId: 'match123',
      type: 'goal',
      data: { score: '1-0' },
    };

    gateway.broadcastMatchUpdate(payload);

    expect(mockServer.to).toHaveBeenCalledWith('match:match123');
    expect(mockServer.emit).toHaveBeenCalledWith(
      MatchSocketEvents.PUBLIC_MATCH_UPDATE,
      payload,
    );
  });
});
