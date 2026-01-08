import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GlobalService } from 'src/common/global-service';
import { MatchEvent, MatchEventDocument } from './events.schema';
import { CreateMatchEventDtoType } from './events.dto';

@Injectable()
export class MatchEventService extends GlobalService<
  MatchEvent,
  MatchEventDocument
> {
  constructor(
    @InjectModel(MatchEvent.name)
    private matchEventModel: Model<MatchEventDocument>,
  ) {
    super(matchEventModel);
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
