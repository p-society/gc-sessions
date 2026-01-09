export enum ReactionSocketEvents {
  PUBLIC_REACTION_BROADCAST = 'pub:reaction:broadcast',
  IN_REACTION_BROADCAST = 'in:reaction:broadcast',
}

export interface ReactionsStreamEvent {
  payload: {
    sport: string;
    emoji: string;
    matchId?: string;
  };
}
