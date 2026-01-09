import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FootballStateController } from './state.controller';
import { MatchStateService } from './state.service';
import { MatchState, MatchStateSchema } from './state.schema';
import { UsersModule } from '../../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../auth/constants/jwt-constants';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MatchState.name, schema: MatchStateSchema },
    ]),
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [FootballStateController],
  providers: [MatchStateService],
  exports: [MatchStateService],
})
export class StateModule {}
