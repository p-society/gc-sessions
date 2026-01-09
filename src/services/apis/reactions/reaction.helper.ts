export function processReaction(reaction: {
  emoji: string;
  sport: string;
  matchId?: string;
}): {
  emoji: string;
  sport: string;
  matchId?: string;
} {
  if (!reaction.emoji || typeof reaction.emoji !== 'string') {
    throw new Error('Invalid emoji: Must be a non-empty string');
  }

  if (!reaction.sport || typeof reaction.sport !== 'string') {
    throw new Error('Invalid sport: Must be a non-empty string');
  }

  return {
    emoji: reaction.emoji.trim(),
    sport: reaction.sport.trim().toLowerCase(),
    matchId: reaction.matchId,
  };
}
