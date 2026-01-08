import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect } from 'mongoose';
import { MatchEventService } from './events.service';
import {
  MatchEvent,
  MatchEventDocument,
  MatchEventSchema,
} from './events.schema';
import { GlobalService } from 'src/common/global-service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MatchSocketEvents } from 'src/services/gateways/constants/match.events';

describe('MatchEventService (Integration)', () => {
  let service: MatchEventService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let eventEmitter: EventEmitter2;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([
          { name: MatchEvent.name, schema: MatchEventSchema },
        ]),
      ],
      providers: [
        MatchEventService,
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MatchEventService>(MatchEventService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should extend GlobalService', () => {
    expect(service).toBeInstanceOf(GlobalService);
  });

  it('should create and retrieve a match event and emit socket event', async () => {
    const eventData = {
      type: 'goal',
      matchId: 'match123',
      timestamp: new Date(),
      details: {
        team: '507f1f77bcf86cd799439011',
        scorer: {
          name: 'Player 1',
          number: 10,
          position: 'FW',
          status: 'active',
        },
        minute: 10,
        description: 'Goal!',
      },
    };

    // @ts-ignore
    const created = await service._create(eventData);
    expect(created).toBeDefined();
    // @ts-ignore
    expect(created.type).toBe('goal');

    expect(eventEmitter.emit).toHaveBeenCalledWith(
      MatchSocketEvents.IN_MATCH_UPDATE,
      expect.objectContaining({
        matchId: 'match123',
        type: 'goal',
      }),
    );

    const found = await service.findByMatch('match123');
    expect(found.length).toBeGreaterThan(0);
    expect(found[0].matchId).toBe('match123');
  });
});
