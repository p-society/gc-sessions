import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect } from 'mongoose';
import { MatchStateService } from './state.service';
import { MatchState, MatchStateSchema } from './state.schema';
import { GlobalService } from 'src/common/global-service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('MatchStateService (Integration)', () => {
  let service: MatchStateService;
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
          { name: MatchState.name, schema: MatchStateSchema },
        ]),
      ],
      providers: [
        MatchStateService,
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MatchStateService>(MatchStateService);
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

  it('should create and retrieve a match state', async () => {
    const stateData = {
      periods: {
        first: { status: 'in_progress' },
        second: { status: 'scheduled' },
      },
      teams: {
        home: { name: 'Home Team' },
        away: { name: 'Away Team' },
      },
      match: { id: 'm1', status: 'scheduled', minute: 0 },
      stats: { home: {}, away: {} },
      matchOutcome: {
        winner: 'none',
        type: 'draw',
        score: { home: 0, away: 0 },
      },
    };

    // @ts-ignore
    const created = await service.create(stateData as any);
    expect(created).toBeDefined();
    expect(created.match.status).toBe('scheduled');
    expect(eventEmitter.emit).toHaveBeenCalled();
  });
});
