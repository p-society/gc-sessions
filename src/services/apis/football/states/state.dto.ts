import { z } from 'zod';

const ScoreSchema = z.object({
  home: z.number(),
  away: z.number(),
});

const AssistSchema = z.object({
  name: z.string(),
  number: z.number(),
});

const ScorerSchema = z.object({
  name: z.string(),
  number: z.number(),
  assist: AssistSchema.optional(),
});

const EventSchema = z.object({
  timestamp: z.string(),
  type: z.string(),
  team: z.string(),
  scorer: ScorerSchema.optional(),
  minute: z.number(),
  description: z.string(),
});

const PeriodSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  score: ScoreSchema,
  possession: z.string(),
  addedTime: z.number().optional(),
  events: z.array(EventSchema),
  status: z.string(),
});

const PenaltyShotSchema = z.object({
  player: z.string(),
  success: z.boolean(),
});

const PlayerStatsSchema = z.object({
  saves: z.number().optional(),
  cleanSheets: z.number().optional(),
  passes: z.number().optional(),
  passAccuracy: z.number().optional(),
});

const PlayerSchema = z.object({
  name: z.string(),
  number: z.number(),
  position: z.string(),
  status: z.string(),
  stats: PlayerStatsSchema.optional(),
  cards: z.array(z.string()).optional(),
});

const TeamCardsSchema = z.object({
  yellow: z.number(),
  red: z.number(),
});

const TeamStatsSchema = z.object({
  possession: z.number(),
  shots: z.object({
    total: z.number(),
    onTarget: z.number(),
    blocked: z.number(),
    woodwork: z.number(),
  }),
  corners: z.number(),
  fouls: z.number(),
  passes: z.object({
    total: z.number(),
    completed: z.number(),
    accuracy: z.number(),
  }),
  offsides: z.number(),
});

export const CreateMatchStateDto = z.object({
  periods: z.object({
    first: PeriodSchema,
    second: PeriodSchema,
    extraTime: z
      .object({
        firstHalf: PeriodSchema,
        secondHalf: PeriodSchema,
      })
      .optional(),
    penalties: z
      .object({
        home: z.array(PenaltyShotSchema),
        away: z.array(PenaltyShotSchema),
        outcome: z.string(),
        score: ScoreSchema,
      })
      .optional(),
  }),
  teams: z.object({
    home: z.object({
      name: z.string(),
      formation: z.string(),
      captain: z.string(),
      lineup: z.array(PlayerSchema),
      substitutes: z.array(PlayerSchema),
      substitutionsLeft: z.number(),
      cards: TeamCardsSchema,
      injuries: z.array(z.string()),
    }),
    away: z.object({
      name: z.string(),
      formation: z.string(),
      captain: z.string(),
      lineup: z.array(PlayerSchema),
      substitutes: z.array(PlayerSchema),
      substitutionsLeft: z.number(),
      cards: TeamCardsSchema,
      injuries: z.array(z.string()),
    }),
  }),
  match: z.object({
    id: z.string(),
    competition: z.string(),
    venue: z.object({
      name: z.string(),
      city: z.string(),
    }),
    officials: z.object({
      referee: z.string(),
      assistants: z.array(z.string()),
      fourthOfficial: z.string(),
      var: z.object({
        referee: z.string(),
        assistant: z.string(),
      }),
    }),
    weather: z.object({
      condition: z.string(),
      temperature: z.number(),
    }),
    status: z.string(),
    minute: z.number(),
  }),
  stats: z.object({
    home: TeamStatsSchema,
    away: TeamStatsSchema,
  }),
  matchOutcome: z.object({
    winner: z.string(),
    type: z.string(),
    score: ScoreSchema,
  }),
});

export type CreateMatchStateDtoType = z.infer<typeof CreateMatchStateDto>;
