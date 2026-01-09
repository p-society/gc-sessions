import { Module } from '@nestjs/common';
import { StateModule } from './states/state.module';
import { FormatModule } from './format/format.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [StateModule, FormatModule, EventsModule],
  exports: [StateModule, FormatModule, EventsModule],
})
export class FootballModule {}
