import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GlobalService } from 'src/common/global-service';
import { MatchState, MatchStateDocument } from './state.schema';
import { CreateMatchStateDtoType } from './state.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MatchSocketEvents } from 'src/services/gateways/constants/match.events';

@Injectable()
export class MatchStateService extends GlobalService<
  MatchState,
  MatchStateDocument
> {
  constructor(
    @InjectModel(MatchState.name)
    private matchStateModel: Model<MatchStateDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super(matchStateModel);
  }

  async create(createStateDto: CreateMatchStateDtoType): Promise<MatchState> {
    const createdState = (await super._create(
      createStateDto as any,
    )) as MatchState;

    this.eventEmitter.emit(MatchSocketEvents.IN_MATCH_UPDATE, {
      matchId: createdState.match.id,
      type: 'state_created',
      data: createdState,
    });

    return createdState;
  }

  async _patch(
    id: string | null,
    data: Partial<MatchState>,
    query: any = {},
  ): Promise<MatchState | MatchState[] | null> {
    const result = await super._patch(id, data, query);

    if (id && result && !Array.isArray(result)) {
      this.eventEmitter.emit(MatchSocketEvents.IN_MATCH_UPDATE, {
        matchId: result.match.id,
        type: 'state_updated',
        data: result,
      });
    }

    return result;
  }

  // Additional methods specific to match state
  async updateScore(
    id: string,
    period: string,
    homeScore: number,
    awayScore: number,
  ): Promise<MatchState> {
    const update = {
      [`periods.${period}.score`]: { home: homeScore, away: awayScore },
    };
    const updated = await this.matchStateModel
      .findByIdAndUpdate(id, update, { new: true })
      .exec();

    if (updated) {
      this.eventEmitter.emit(MatchSocketEvents.IN_MATCH_UPDATE, {
        matchId: updated.match.id,
        type: 'score_update',
        data: updated,
      });
    }

    return updated;
  }

  async addEvent(id: string, period: string, event: any): Promise<MatchState> {
    const updated = await this.matchStateModel
      .findByIdAndUpdate(
        id,
        { $push: { [`periods.${period}.events`]: event } },
        { new: true },
      )
      .exec();

    if (updated) {
      this.eventEmitter.emit(MatchSocketEvents.IN_MATCH_UPDATE, {
        matchId: updated.match.id,
        type: 'timeline_event',
        data: updated,
      });
    }

    return updated;
  }

  async updateMatchStatus(
    id: string,
    status: string,
    minute: number,
  ): Promise<MatchState> {
    const updated = await this.matchStateModel
      .findByIdAndUpdate(
        id,
        {
          'match.status': status,
          'match.minute': minute,
        },
        { new: true },
      )
      .exec();

    if (updated) {
      this.eventEmitter.emit(MatchSocketEvents.IN_MATCH_UPDATE, {
        matchId: updated.match.id,
        type: 'status_update',
        data: updated,
      });
    }

    return updated;
  }
}
