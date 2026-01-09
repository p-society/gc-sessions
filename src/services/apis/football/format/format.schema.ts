// match-format.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SoftDeleteSchema } from 'src/common/soft-delete-schema';
import { Document } from 'mongoose';

export type MatchFormatDocument = MatchFormat & Document;

interface PenaltyAction {
  type: string;
  penalty: string;
  description: string;
}

interface ExtraAction {
  type: string;
  opportunity: string;
  description: string;
}

interface ExtraTime {
  isDraw: boolean;
  description: string;
}

@Schema({ timestamps: true })
export class MatchFormat extends SoftDeleteSchema {
  @Prop({ required: true })
  totalDuration: number;

  @Prop({ required: true })
  halfTimeDuration: number;

  @Prop({ required: true })
  totalHalves: number;

  @Prop({ required: true })
  penaltyShootoutMaxAttempts: number;

  @Prop({ type: [Object], required: true })
  penaltyActions: PenaltyAction[];

  @Prop({ type: [Object], required: true })
  extraActions: ExtraAction[];

  @Prop({ type: Object, required: true })
  applyExtraTime: ExtraTime;
}

export const MatchFormatSchema = SchemaFactory.createForClass(MatchFormat);
