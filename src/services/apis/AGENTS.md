# API Agents (Business Logic Modules)

## OVERVIEW

The `src/services/apis` directory houses the core business logic for the college Grand Championships platform. Modules represent key tournament entities (e.g., `matches` for the 15+ sports games, `teams` and `squads` for participants, `reactions` for live feedback). Each module follows a strict, uniform architectural pattern to ensure consistency, maintainability, and rapid development.

## STRUCTURE

A standard API module contains the following components:

- **Controller (`*.controller.ts`)**: Handles incoming HTTP requests and maps them to service methods.
- **Service (`*.service.ts`)**: Contains business logic and interacts with the database. Extends `GlobalService`.
- **Module (`*.module.ts`)**: NestJS module that ties together controllers, services, and schemas.
- **DTO (`dto/*.dto.ts`)**: Data Transfer Objects for request validation and type safety.
- **Schema (`schemas/*.schema.ts`)**: Mongoose schema definition. Extends `SoftDeleteSchema`.
- **Specs (`*.spec.ts`)**: Unit tests for both the controller and service.

## WHERE TO LOOK

- **Base Service**: `src/common/global-service.ts` (Provides CRUD: `_find`, `_get`, `_create`, `_patch`, `_remove`).
- **Base Schema**: `src/common/soft-delete-schema.ts` (Provides `deleted`, `deletedBy`, `deletedAt`).
- **Generator**: `generate/index.js` (The source of truth for the standard pattern).

## CONVENTIONS (The Standard Pattern)

All domain modules MUST adhere to these conventions:

1.  **Inheritance**:
    - Services must extend `GlobalService<T, TDocument>` to inherit standardized CRUD operations.
    - Schemas should extend `SoftDeleteSchema` to support the application's soft-delete mechanism.
2.  **Naming**: Use kebab-case for directory names and camelCase/PascalCase for file contents as established by the generator.
3.  **CRUD**: Prefer using the inherited `_find`, `_create`, etc., methods from `GlobalService` unless complex custom logic is required.

### Adding a New API Module

Do NOT create files manually. Use the provided generator tool:

```bash
# Example: Creating a 'product' module
node generate/index.js product
```

This command generates the entire directory structure, boilerplate code, and tests following the standard pattern.

## ANTI-PATTERNS

- **Manual File Creation**: Avoid creating module files by hand; it leads to naming inconsistencies and missing boilerplate.
- **Deviating from GlobalService**: Don't rewrite basic CRUD logic. If the standard `GlobalService` methods don't fit, consider if the domain model itself needs adjustment or extend the service with custom methods while keeping the inheritance.
- **Ignoring SoftDelete**: Always extend `SoftDeleteSchema` for persistent entities to ensure data can be safely "removed" without losing history.
