import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TeamPlayerStatus } from '../constants/TeamPlayerEnum';

export type TeamPlayersDocument = HydratedDocument<TeamPlayer>;

@Schema({
  timestamps: true,
})
export class TeamPlayer {
  @Prop({ type: Types.ObjectId, ref: 'Team', required: true })
  team: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(TeamPlayerStatus),
    default: TeamPlayerStatus.Playing,
  })
  status: TeamPlayerStatus;
}

export const TeamPlayersSchema = SchemaFactory.createForClass(TeamPlayer);
