import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GlobalService } from 'src/common/global-service';
import { MatchState, MatchStateDocument } from './state.schema';
import { CreateMatchStateDtoType } from './state.dto';

@Injectable()
export class MatchStateService extends GlobalService<
  MatchState,
  MatchStateDocument
> {
  constructor(
    @InjectModel(MatchState.name)
    private matchStateModel: Model<MatchStateDocument>,
  ) {
    super(matchStateModel);
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
    return this.matchStateModel
      .findByIdAndUpdate(id, update, { new: true })
      .exec();
  }

  async addEvent(id: string, period: string, event: any): Promise<MatchState> {
    return this.matchStateModel
      .findByIdAndUpdate(
        id,
        { $push: { [`periods.${period}.events`]: event } },
        { new: true },
      )
      .exec();
  }

  async updateMatchStatus(
    id: string,
    status: string,
    minute: number,
  ): Promise<MatchState> {
    return this.matchStateModel
      .findByIdAndUpdate(
        id,
        {
          'match.status': status,
          'match.minute': minute,
        },
        { new: true },
      )
      .exec();
  }
}
