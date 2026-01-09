import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { PresenceGateway } from '../presence/presence.gateway';
import { OnEvent } from '@nestjs/event-emitter';
import {
  MatchSocketEvents,
  MatchUpdatePayload,
} from '../constants/match.events';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MatchGateway {
  private readonly logger = new Logger(MatchGateway.name);

  constructor(private readonly presenceGateway: PresenceGateway) {}

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.log('Match WebSocket Gateway Initialized');
  }

  @OnEvent(MatchSocketEvents.IN_MATCH_UPDATE)
  broadcastMatchUpdate(payload: MatchUpdatePayload) {
    this.presenceGateway.server
      .to(`match:${payload.matchId}`)
      .emit(MatchSocketEvents.PUBLIC_MATCH_UPDATE, payload);
    this.presenceGateway.server.emit(
      MatchSocketEvents.PUBLIC_MATCH_UPDATE,
      payload,
    );
  }
}
