# GENERATE MODULE KNOWLEDGE BASE

**Purpose:** Scaffolding tool for rapid module creation.
**Command:** `node generate/index.js <module-name>`

## OVERVIEW

The `generate` tool is a custom utility designed to maintain consistency across the project by scaffolding a complete NestJS feature module with a single command. It ensures all services extend `GlobalService`, schemas follow the soft-delete pattern, and file structures remain uniform.

## USAGE

To create a new module, run the following command from the root directory:

```bash
# Example: Creating a 'squad' module
node generate/index.js squad

# Example: Creating a multi-word module
node generate/index.js user-profile
```

- **Input:** Kebab-case name (e.g., `user-profile`)
- **Output:** Camel-case directory (e.g., `src/services/apis/userProfile/`) and PascalCase classes (e.g., `UserProfileService`).

## TEMPLATES (What it creates)

Running the command generates the following file structure:

```text
src/services/apis/<name>/
├── dto/
│   └── <name>.dto.ts           # Zod validation/DTOs
├── schemas/
│   └── <name>.schema.ts        # Mongoose schema (extends SoftDeleteSchema)
├── <name>.controller.spec.ts   # Controller tests
├── <name>.controller.ts        # REST controller with CRUD endpoints
├── <name>.module.ts            # NestJS module definition
├── <name>.service.spec.ts      # Service tests
└── <name>.service.ts           # Business logic (extends GlobalService)
```

## CONVENTIONS

- **Folder Names:** Always camelCase (derived from kebab-case input).
- **Class Names:** Always PascalCase.
- **Service Inheritance:** All generated services extend `GlobalService`, providing built-in `_find`, `_get`, `_create`, `_patch`, and `_remove` methods.
- **Schema Inheritance:** Uses Mongoose schemas with built-in support for `createdBy`, `deleted`, `deletedBy`, and `deletedAt`.
- **Validation:** Controllers use `@ModifyBody(setCreatedBy())` for automatic audit trail management during creation.

## ANTI-PATTERNS

- **Manual Creation:** Avoid creating these files manually. Use the generator to ensure all base class requirements and imports are correctly set up.
- **Namespace Collision:** Ensure `<module-name>` is unique within `src/services/apis/`.
