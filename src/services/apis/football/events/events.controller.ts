import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MatchEventService } from './events.service';
import { CreateMatchEventDtoType } from './events.dto';
import { RolesGuard } from '../../users/roles.guard';
import { Roles } from '../../users/decorator/roles.decorator';
import { UserRole } from '../../users/constants/user-role';
import { AuthGuard } from '../../auth/auth.guard';

@Controller('football')
export class FootballEventController {
  constructor(private readonly eventService: MatchEventService) {}

  @Get(':matchId/event')
  async getLatestEvent(
    @Param('matchId') matchId: string,
    @Query('id') previousEventId?: string,
  ) {
    if (previousEventId) {
      const events = await this.eventService.findByMatch(matchId);
      const prevEventIndex = events.findIndex((e) => e.id === previousEventId);
      if (prevEventIndex === -1) {
        throw new NotFoundException('Previous event not found');
      }
      return events[prevEventIndex + 1] || null;
    }
    const events = await this.eventService.findByMatch(matchId);
    return events[events.length - 1] || null;
  }

  @Get(':matchId/event-series')
  async getEventSeries(
    @Param('matchId') matchId: string,
    @Query('id') previousEventId?: string,
  ) {
    let events = await this.eventService.findByMatch(matchId);
    events = events.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
    );
    if (previousEventId) {
      const prevEventIndex = events.findIndex((e) => e.id === previousEventId);
      if (prevEventIndex === -1) {
        throw new NotFoundException('Previous event not found');
      }
      return events.slice(0, prevEventIndex);
    }
    return events;
  }

  @Post(':matchId/event')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  createEvent(
    @Param('matchId') matchId: string,
    @Body() createEventDto: CreateMatchEventDtoType,
  ) {
    const eventWithMatchId = {
      ...createEventDto,
      matchId,
      timestamp: new Date(),
    };
    return this.eventService._create(eventWithMatchId);
  }

  @Patch('event/:eventId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateEvent(
    @Param('eventId') eventId: string,
    @Body() updateEventDto: Partial<CreateMatchEventDtoType>,
  ) {
    return this.eventService._patch(eventId, updateEventDto);
  }

  @Delete('event/:eventId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  removeEvent(@Param('eventId') eventId: string, @Req() req: any) {
    return this.eventService._remove(eventId, {}, req.user);
  }
}
