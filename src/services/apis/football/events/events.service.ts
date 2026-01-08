import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GlobalService } from 'src/common/global-service';
import { MatchEvent, MatchEventDocument } from './events.schema';
import { CreateMatchEventDtoType } from './events.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MatchSocketEvents } from 'src/services/gateways/constants/match.events';

@Injectable()
export class MatchEventService extends GlobalService<
  MatchEvent,
  MatchEventDocument
> {
  constructor(
    @InjectModel(MatchEvent.name)
    private matchEventModel: Model<MatchEventDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super(matchEventModel);
  }

  async create(createEventDto: CreateMatchEventDtoType): Promise<MatchEvent> {
    const createdEvent = new this.matchEventModel(createEventDto);
    const savedEvent = await createdEvent.save();

    this.eventEmitter.emit(MatchSocketEvents.IN_MATCH_UPDATE, {
      matchId: savedEvent.matchId,
      type: savedEvent.type,
      data: savedEvent,
    });

    return savedEvent;
  }

  async _create(
    data: MatchEvent | MatchEvent[],
    needsMulti: boolean | undefined = undefined,
  ): Promise<MatchEvent | MatchEvent[]> {
    const result = await super._create(data, needsMulti);

    if (Array.isArray(result)) {
      result.forEach((event) => {
        this.eventEmitter.emit(MatchSocketEvents.IN_MATCH_UPDATE, {
          matchId: event.matchId,
          type: event.type,
          data: event,
        });
      });
    } else {
      this.eventEmitter.emit(MatchSocketEvents.IN_MATCH_UPDATE, {
        matchId: result.matchId,
        type: result.type,
        data: result,
      });
    }

    return result;
  }

  async findByMatch(matchId: string): Promise<MatchEvent[]> {
    return this.matchEventModel.find({ matchId }).sort({ timestamp: 1 }).exec();
  }

  async findByType(matchId: string, type: string): Promise<MatchEvent[]> {
    return this.matchEventModel
      .find({ matchId, type })
      .sort({ timestamp: 1 })
      .exec();
  }

  // Additional utility methods
  async getEventsByTimeRange(
    matchId: string,
    startMinute: number,
    endMinute: number,
  ): Promise<MatchEvent[]> {
    return this.matchEventModel
      .find({
        matchId,
        'details.minute': { $gte: startMinute, $lte: endMinute },
      })
      .sort({ 'details.minute': 1 })
      .exec();
  }

  async getPlayerEvents(
    matchId: string,
    playerName: string,
  ): Promise<MatchEvent[]> {
    return this.matchEventModel
      .find({
        matchId,
        $or: [
          { 'details.player.name': playerName },
          { 'details.scorer.name': playerName },
          { 'details.scorer.assist.name': playerName },
          { 'details.outPlayer.name': playerName },
          { 'details.inPlayer.name': playerName },
        ],
      })
      .sort({ timestamp: 1 })
      .exec();
  }

  async getTeamEvents(matchId: string, team: string): Promise<MatchEvent[]> {
    return this.matchEventModel
      .find({
        matchId,
        'details.team': team,
      })
      .sort({ timestamp: 1 })
      .exec();
  }
}
