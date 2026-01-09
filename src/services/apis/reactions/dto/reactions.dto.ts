/**
 * DTO for incoming reaction payload.
 * This ensures the payload structure and validates fields.
 */
export class ReactionDto {
  emoji: string;
  sport: string;
  matchId?: string;
}
