# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-08
**Framework:** NestJS + Mongoose + Redis (BullMQ) + Socket.IO

## OVERVIEW
Backend API service for "gc-broadcast", a system managing yearly college Grand Championships (15+ sports like football, cricket, tennis).
It provides live scoreboards, real-time user reactions, and match management.

Built with NestJS, it uses MongoDB for persistence, Redis for caching/queues/adapters, and WebSockets for real-time features.
Features a custom module generator and strict service-inheritance pattern.

## STRUCTURE
```
.
├── generate/                # Custom scaffolding tool (Use this!)
├── src/
│   ├── common/              # Shared base classes (GlobalService, SoftDeleteSchema)
│   ├── services/
│   │   ├── apis/            # REST API Features (Users, Team, Squad, etc.)
│   │   ├── bullmq/          # Async job queues
│   │   ├── gateways/        # WebSocket gateways
│   │   └── redis/           # Redis infrastructure
│   ├── constants/           # Global constants
│   ├── decorators/          # Custom decorators
│   ├── filters/             # Global exception filters
│   ├── types/               # Shared TypeScript types
│   └── main.ts              # Entry point (Port 3030)
├── test/                    # E2E tests
└── env/                     # Environment setup scripts
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| **Add New Feature** | `generate/` | Run `node generate/index.js <name>` |
| **Business Logic** | `src/services/apis/{name}/*.service.ts` | Extends `GlobalService` |
| **Data Models** | `src/services/apis/{name}/schemas/*.schema.ts` | Extends `SoftDeleteSchema` |
| **Real-time** | `src/services/gateways/` | Socket.IO events |
| **Background Jobs** | `src/services/bullmq/` | BullMQ processors |
| **Shared Utils** | `src/common/` | Base classes & helpers |

## CONVENTIONS
- **Module Structure**: `src/services/apis` is the source of truth for features.
- **Inheritance**:
  - Services MUST extend `GlobalService` (provides CRUD + search).
  - Schemas MUST extend `SoftDeleteSchema` (provides `deletedAt`).
- **Scaffolding**: NEVER create modules manually. Use `generate/index.js`.
- **Validation**: Zod is used for DTOs (`*.dto.ts`).
- **Config**: `env/` directory manages environment variables.

## ANTI-PATTERNS (THIS PROJECT)
- **Manual Module Creation**: Do not manually create controller/service files; they will likely miss base class inheritance or naming conventions.
- **WebSocket Auth**: Do NOT use `SocketGuard`. Use `SocketAuthMiddleware`.
- **Deep Nesting**: Avoid nesting beyond `src/services/apis/{domain}`.

## COMMANDS
```bash
# Development
npm run start:dev

# Generate New Module
node generate/index.js my-feature

# Testing
npm run test          # Unit
npm run test:e2e      # E2E
npm run test:cov      # Coverage
```

## NOTES
- **Ports**: Default is 3030.
- **Redis**: Required for both BullMQ and WebSocket adapter.
- **Docker**: `docker/` folder exists (check for compose files).
