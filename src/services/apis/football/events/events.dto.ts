import { z } from 'zod';
import { Types } from 'mongoose';

// Reflecting TeamPlayer fields in the schema

export const GoalEventSchema = z.object({
  type: z.literal('goal'),
  details: z.object({
    team: z.instanceof(Types.ObjectId),
    scorer: z.instanceof(Types.ObjectId),
    assist: z.instanceof(Types.ObjectId).optional(),
    minute: z.number().int().min(0),
    description: z.string(),
  }),
  timestamp: z.date(),
  matchId: z.string(),
});

export const SubstitutionEventSchema = z.object({
  type: z.literal('substitution'),
  details: z.object({
    team: z.instanceof(Types.ObjectId),
    outPlayer: z.instanceof(Types.ObjectId),
    inPlayer: z.instanceof(Types.ObjectId),
    minute: z.number().int().min(0),
  }),
  timestamp: z.date(),
  matchId: z.string(),
});

export const FoulEventSchema = z.object({
  type: z.literal('foul'),
  details: z.object({
    team: z.instanceof(Types.ObjectId),
    player: z.instanceof(Types.ObjectId),
    type: z.string(),
    card: z.enum(['yellow', 'red', 'none']),
    minute: z.number().int().min(0),
  }),
  timestamp: z.date(),
  matchId: z.string(),
});

export const InjuryEventSchema = z.object({
  type: z.literal('injury'),
  details: z.object({
    team: z.instanceof(Types.ObjectId),
    player: z.instanceof(Types.ObjectId),
    severity: z.enum(['minor', 'moderate', 'severe']),
    minute: z.number().int().min(0),
  }),
  timestamp: z.date(),
  matchId: z.string(),
});

export const PenaltyEventSchema = z.object({
  type: z.literal('penalty'),
  details: z.object({
    team: z.instanceof(Types.ObjectId),
    player: z.instanceof(Types.ObjectId),
    success: z.boolean(),
    minute: z.number().int().min(0),
  }),
  timestamp: z.date(),
  matchId: z.string(),
});

export const GenericEventSchema = z.object({
  type: z.literal('generic'),
  details: z.object({
    description: z.string(),
    minute: z.number().int().min(0),
    data: z.record(z.string(), z.any()),
  }),
  timestamp: z.date(),
  matchId: z.string(),
});

export const CreateMatchEventDto = z.discriminatedUnion('type', [
  GoalEventSchema,
  SubstitutionEventSchema,
  FoulEventSchema,
  InjuryEventSchema,
  PenaltyEventSchema,
  GenericEventSchema,
]);

export type CreateMatchEventDtoType = z.infer<typeof CreateMatchEventDto>;
