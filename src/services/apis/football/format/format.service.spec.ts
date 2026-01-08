import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect } from 'mongoose';
import { MatchFormatService } from './format.service';
import { MatchFormat, MatchFormatSchema } from './format.schema';
import { GlobalService } from 'src/common/global-service';

describe('MatchFormatService (Integration)', () => {
  let service: MatchFormatService;
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
          { name: MatchFormat.name, schema: MatchFormatSchema },
        ]),
      ],
      providers: [MatchFormatService],
    }).compile();

    service = module.get<MatchFormatService>(MatchFormatService);
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

  it('should create and retrieve a match format', async () => {
    const formatData = {
      totalDuration: 90,
      halfTimeDuration: 15,
      totalHalves: 2,
      penaltyShootoutMaxAttempts: 5,
      penaltyActions: [],
      extraActions: [],
      applyExtraTime: { isDraw: true, description: 'Extra time if draw' },
    };

    // @ts-ignore
    const created = await service._create(formatData);
    expect(created).toBeDefined();
    // @ts-ignore
    expect(created.totalDuration).toBe(90);

    const found = await service._find({});
    // @ts-ignore
    expect(found.data.length).toBeGreaterThan(0);
  });
});
