# Real-time Gateways Knowledge Base

## OVERVIEW

The `gateways` directory serves as the real-time communication hub of the "gc-broadcast" application, built on NestJS and Socket.IO. Its primary responsibility is to maintain persistent connections with clients, track their online/offline status, and facilitate low-latency broadcasting of events like user reactions and system updates.

The architecture leverages Redis for session persistence and state synchronization, ensuring that presence data remains accurate even across multiple server instances.

## STRUCTURE

- **`presence/`**: Manages the lifecycle of WebSocket connections. It includes the `PresenceGateway`, which tracks when users join or leave and updates their status in the Redis store.
- **`reactions/`**: Specialized gateway for broadcasting high-frequency user interactions (e.g., emojis during a live stream). It consumes internal events and pushes them to clients.
- **`constants/`**: Contains `presence.events.ts` and `reaction.events.ts`. These files define the source of truth for all event strings used in the WebSocket layer.

## WHERE TO LOOK

- **`PresenceGateway`**: Core logic for connection handling (`handleConnection`, `handleDisconnect`). It also implements the `heartbeat` mechanism to keep sessions alive.
- **`ReactionGateway`**: Listens for internal `ReactionSocketEvents.IN_REACTION_BROADCAST` via NestJS `EventEmitter2` and emits `pub:reaction:broadcast` to clients.
- **`SocketAuthMiddleware`**: Applied in the `afterInit` hook of gateways to validate JWT tokens before allowing a connection to be established.

## CONVENTIONS

- **Socket.IO Namespace**: All gateways should prefer using the `v1/events` namespace for versioning and logical separation of traffic.
- **Prefixing Strategy**:
  - **`in:`**: Internal events. These are either sent from the client to the server or used internally within the server's event bus.
  - **`pub:`**: Public/Broadcast events. These are sent from the server to one or more connected clients.
- **Presence Tracking**: Use Redis keys in the format `user:{userID}:socket:{socketID}`. This allows a single user to have multiple active connections simultaneously.
- **Graceful Disconnects**: Always ensure `client.disconnect(true)` is called in `handleDisconnect` and session data is cleaned up from Redis to prevent "ghost" users.
- **Socket Adapters**: The project uses the standard Redis adapter for Socket.IO, enabling horizontal scaling across multiple pods by synchronizing events through Redis Pub/Sub.
- **Error Handling**: Use the global exception filters tailored for WebSockets to ensure that errors during event processing are properly communicated back to the client or logged without crashing the gateway.
- **Scaling**: Because we use Redis for state, any instance of the application can handle requests for any user, as long as they are connected to the same Redis cluster.
