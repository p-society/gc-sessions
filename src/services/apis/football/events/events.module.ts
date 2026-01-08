import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FootballEventController } from './events.controller';
import { MatchEventService } from './events.service';
import { MatchEvent, MatchEventSchema } from './events.schema';
import { UsersModule } from '../../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../auth/constants/jwt-constants';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MatchEvent.name, schema: MatchEventSchema },
    ]),
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [FootballEventController],
  providers: [MatchEventService],
  exports: [MatchEventService],
})
export class EventsModule {}
