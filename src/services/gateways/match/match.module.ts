import { Module } from '@nestjs/common';
import { MatchGateway } from './match.gateway';
import { PresenceModule } from '../presence/presence.module';

@Module({
  imports: [PresenceModule],
  providers: [MatchGateway],
  exports: [MatchGateway],
})
export class MatchGatewayModule {}
