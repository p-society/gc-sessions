# Grand Championship MVP Implementation Plan

**Context:** Backend system for a college Grand Championship featuring 15+ sports.
**Target Sports (MVP):** Cricket, Football, Volleyball, Badminton, Table Tennis.
**Goal:** Implement robust, type-safe scoring and match management while adhering to the project's strict architecture (NestJS + Mongoose + GlobalService).

## 1. System Architecture & Design

To avoid creating 15+ separate modules (e.g., `cricket-service`, `football-service`), we will enhance the existing `matches` module to be **polymorphic**.

### Data Model Strategy (`src/services/apis/matches`)
Instead of fixed fields for every sport, the `Match` schema will utilize a **Discriminated Union** pattern (or strict application-layer validation) for scoring data.

- **Field: `sportType`**: Enum (`CRICKET`, `FOOTBALL`, `VOLLEYBALL`, `BADMINTON`, `TABLE_TENNIS`, etc.).
- **Field: `scoreDetails`**: A flexible schema (`type: Object`) in Mongoose, but **strictly validated** by Zod DTOs in the Service layer based on `sportType`.

### Real-Time Architecture
- **Gateway**: Reuse or extend `src/services/gateways/reaction` (or create `src/services/gateways/match`) to broadcast score updates.
- **Events**:
  - `pub:match:update`: Broadcasts full score object to subscribers of a specific match ID.
  - `in:match:update`: (Admin/Ref only) Incoming event to update score (alternatively use REST API).

---

## 2. Sport-Specific MVP Requirements

### A. Cricket
*Complex state management.*
- **State**:
  - `currentInnings`: 1 or 2.
  - `battingTeamId`: ID of team batting.
  - `runs`: Total runs.
  - `wickets`: Total wickets (0-10).
  - `overs`: Current over (e.g., 10.4).
  - `currentBatsmen`: Array of 2 player IDs (striker/non-striker).
  - `currentBowler`: Player ID.
- **MVP Feature**: Admin updates "Ball End" (outcome: 1, 4, 6, W, WD, NB). System auto-calculates totals.

### B. Football
*Time-sensitive.*
- **State**:
  - `teamAGoals`: Integer.
  - `teamBGoals`: Integer.
  - `matchTime`: Minutes played (or start timestamp).
  - `period`: 1st Half, 2nd Half, Extra Time.
  - `cards`: Array of `{ playerId, type: 'YELLOW' | 'RED', time }`.

### C. Volleyball / Badminton / Table Tennis
*Set-based logic (very similar structures).*
- **State**:
  - `sets`: Object `{ teamA: number, teamB: number }`.
  - `currentSetScore`: Object `{ teamA: number, teamB: number }`.
  - `finishedSets`: Array of scores `[{ teamA: 21, teamB: 19 }, ...]`.
  - `servingTeamId`: ID of team currently serving.

---

## 3. Implementation Roadmap

### Phase 1: Schema & Types (Type Safety Foundation)
1.  **Update `Match` Schema**:
    -   Add `sportType` (Enum).
    -   Add `scoreDetails` (Mixed/Object).
    -   Ensure it extends `SoftDeleteSchema`.
2.  **Define Zod DTOs**:
    -   Create `src/services/apis/matches/dto/scores/cricket.dto.ts`
    -   Create `src/services/apis/matches/dto/scores/football.dto.ts`
    -   ...etc.
    -   Create a Union Type DTO: `ScoreUpdateDto` that discriminates based on `sportType`.

### Phase 2: Service Logic (The Brains)
1.  **Refactor `MatchesService`**:
    -   Override `_patch` or create a specialized `updateScore(id, payload)` method.
    -   **Validation Logic**:
        ```typescript
        if (match.sportType === 'CRICKET') CricketScoreSchema.parse(payload);
        if (match.sportType === 'FOOTBALL') FootballScoreSchema.parse(payload);
        ```
    -   **Persistence**: Save the validated object to MongoDB.

### Phase 3: Real-Time Broadcasting
1.  **Inject Gateway**: Inject `MatchGateway` (or `ReactionGateway`) into `MatchesService`.
2.  **Broadcast**:
    -   After a successful DB update, emit `pub:match:update` with the new state.
    -   Redis Adapter ensures this works across scaled instances.

---

## 4. Adherence to Coding Standards

| Requirement | Implementation |
|-------------|----------------|
| **Scaffolding** | Use `node generate/index.js` if a new module is ever needed (unlikely here). |
| **Inheritance** | `MatchesService extends GlobalService`. `Match extends SoftDeleteSchema`. |
| **Validation** | Zod schemas for *every* sport type. No `any` types in DTOs. |
| **Real-time** | Use `SocketAuthMiddleware` for admin score updates via socket (if applicable). |
| **Async Tasks** | Use BullMQ (`src/services/bullmq`) if we need to process match notifications (e.g., "Match Started" push notification). |

## 5. Next Steps for Developer

1.  Open `src/services/apis/matches/schemas/matches.schema.ts` and add the `sportType` and `scoreDetails` fields.
2.  Open `src/services/apis/matches/dto/matches.dto.ts` and start defining the sport-specific Zod shapes.
