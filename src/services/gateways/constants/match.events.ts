export enum MatchSocketEvents {
  IN_MATCH_UPDATE = 'in:match:update',
  PUBLIC_MATCH_UPDATE = 'pub:match:update',
}

export interface MatchUpdatePayload {
  matchId: string;
  type: string;
  data: any;
}
