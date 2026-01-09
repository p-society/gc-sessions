import { z } from 'zod';
import {
  PenaltyActionType,
  PenaltyType,
  ExtraActionType,
  OpportunityType,
} from '../../../../constants/match-format.constants';

export const PenaltyActionSchema = z.object({
  type: z.nativeEnum(PenaltyActionType), // Uses the enum from constants
  penalty: z.nativeEnum(PenaltyType), // Uses the enum from constants
  description: z.string().min(1, 'Description cannot be empty'),
});

export const ExtraActionSchema = z.object({
  type: z.nativeEnum(ExtraActionType), // Uses the enum from constants
  opportunity: z.nativeEnum(OpportunityType), // Uses the enum from constants
  description: z.string().min(1, 'Description cannot be empty'),
});

export const ExtraTimeSchema = z.object({
  isDraw: z.boolean(),
  description: z.string().min(1, 'Description cannot be empty'),
});

export const CreateMatchFormatDto = z.object({
  totalDuration: z.number().min(1, 'Total duration must be at least 1 minute'),
  halfTimeDuration: z
    .number()
    .min(1, 'Half-time duration must be at least 1 minute'),
  totalHalves: z.number().min(1).default(2), // Default: 2 halves
  penaltyShootoutMaxAttempts: z.number().min(1).max(10),
  penaltyActions: z
    .array(PenaltyActionSchema)
    .min(1, 'At least one penalty action must be defined'),
  extraActions: z
    .array(ExtraActionSchema)
    .min(1, 'At least one extra action must be defined'),
  applyExtraTime: ExtraTimeSchema,
});

export type CreateMatchFormatDtoType = z.infer<typeof CreateMatchFormatDto>;
