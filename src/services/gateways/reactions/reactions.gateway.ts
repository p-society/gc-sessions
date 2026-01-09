import { WebSocketGateway } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { PresenceGateway } from '../presence/presence.gateway';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ReactionSocketEvents,
  ReactionsStreamEvent,
} from '../constants/reaction.events';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ReactionGateway {
  private readonly logger = new Logger(ReactionGateway.name);

  constructor(private readonly presenceGateway: PresenceGateway) {}

  afterInit() {
    this.logInfo('WebSocket Gateway Initialized');
  }

  @OnEvent(ReactionSocketEvents.IN_REACTION_BROADCAST)
  broadcastReactionsToClients(event: ReactionsStreamEvent) {
    if (event.payload.matchId) {
      this.presenceGateway.server
        .to(`match:${event.payload.matchId}`)
        .emit(ReactionSocketEvents.PUBLIC_REACTION_BROADCAST, event);
    } else if (event.payload.sport) {
      this.presenceGateway.server
        .to(`sport:${event.payload.sport}`)
        .emit(ReactionSocketEvents.PUBLIC_REACTION_BROADCAST, event);
    } else {
      this.presenceGateway.server.emit(
        ReactionSocketEvents.PUBLIC_REACTION_BROADCAST,
        event,
      );
    }
  }

  private logInfo(message: string): void {
    this.logger.log(`[INFO]: ${message}`);
  }
}
