import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SoftDeleteSchema } from 'src/common/soft-delete-schema';
import { TeamPlayer } from '../../teamPlayer/schemas/teamPlayer.schema';
import { cardType, severityType } from './constants/football.enum';

export type MatchEventDocument = MatchEvent & Document;

// Common interfaces

// Event-specific detail interfaces
interface GoalDetails {
  team: Types.ObjectId;
  scorer: TeamPlayer;
  assist?: TeamPlayer;
  minute: number;
  description: string;
}

interface SubstitutionDetails {
  team: Types.ObjectId;
  outPlayer: TeamPlayer;
  inPlayer: TeamPlayer;
  minute: number;
}

interface FoulDetails {
  team: Types.ObjectId;
  player: TeamPlayer;
  type: string;
  card: cardType;
  minute: number;
}

interface InjuryDetails {
  team: Types.ObjectId;
  player: TeamPlayer;
  severity: severityType;
  minute: number;
}

interface PenaltyDetails {
  team: Types.ObjectId;
  player: TeamPlayer;
  success: boolean;
  minute: number;
}

interface GenericEventDetails {
  description: string;
  minute: number;
  data: Record<string, any>;
}

type EventDetails =
  | GoalDetails
  | SubstitutionDetails
  | FoulDetails
  | InjuryDetails
  | PenaltyDetails
  | GenericEventDetails;

@Schema({ timestamps: true })
export class MatchEvent extends SoftDeleteSchema {
  @Prop({
    required: true,
    enum: ['goal', 'substitution', 'foul', 'injury', 'penalty', 'var_decision'],
  })
  type: string;

  @Prop({ type: Object, required: true })
  details: EventDetails;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  matchId: string;
}

export const MatchEventSchema = SchemaFactory.createForClass(MatchEvent);
