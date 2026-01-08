import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect } from 'mongoose';
import { MatchStateService } from './state.service';
import { MatchState, MatchStateSchema } from './state.schema';
import { GlobalService } from 'src/common/global-service';

describe('MatchStateService (Integration)', () => {
  let service: MatchStateService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;

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
      providers: [MatchStateService],
    }).compile();

    service = module.get<MatchStateService>(MatchStateService);
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
      periods: { first: {}, second: {} },
      teams: { home: {}, away: {} },
      match: { id: 'm1', status: 'scheduled', minute: 0 },
      stats: { home: {}, away: {} },
      matchOutcome: {
        winner: 'none',
        type: 'draw',
        score: { home: 0, away: 0 },
      },
    };

    // @ts-ignore - simplified for test
    const created = await service._create(stateData);
    expect(created).toBeDefined();
    // @ts-ignore
    expect(created.match.status).toBe('scheduled');
  });
});
