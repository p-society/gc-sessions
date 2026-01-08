# Common Utilities & Base Classes

## OVERVIEW

The `src/common` directory contains shared utilities, base classes, and helper functions used throughout the application. These components establish the foundational patterns for service inheritance, database schemas, and common cross-cutting concerns like security and communication.

## KEY COMPONENTS

1.  **`GlobalService`**: A base class that provides standardized CRUD operations (`_find`, `_get`, `_create`, `_patch`, `_remove`) with built-in support for soft-deletion, pagination, and query filtering.
2.  **`SoftDeleteSchema`**: A base class for Mongoose schemas that adds `deleted`, `deletedBy`, and `deletedAt` fields, enabling consistent soft-delete tracking across all entities.
3.  **`hashing.ts`**: Security utilities for asynchronous string hashing and comparison using `bcryptjs`.
4.  **`Mailer`**: A service wrapper for `nodemailer` providing methods to send OTPs and password reset emails.
5.  **`EnsureObjectId`**: A utility used in schemas to ensure field values are properly cast to Mongoose `Types.ObjectId`.
6.  **`featherify` & `query.utils`**: Internal helpers for `GlobalService` that handle query parameter parsing and FeathersJS-style pagination.

## USAGE

### 1. Extending SoftDeleteSchema

Inherit from `SoftDeleteSchema` in your Mongoose class definitions to automatically include auditing fields for soft-deletions.

```typescript
import { Prop, Schema } from '@nestjs/mongoose';
import { SoftDeleteSchema } from 'src/common/soft-delete-schema';

@Schema({ timestamps: true })
export class MyFeature extends SoftDeleteSchema {
  @Prop({ required: true })
  name: string;
}
```

### 2. Extending GlobalService

Inherit from `GlobalService` in your services to leverage standardized CRUD methods. This ensures consistent API behavior across different modules.

```typescript
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GlobalService } from 'src/common/global-service';
import { MyFeature, MyFeatureDocument } from './schemas/my-feature.schema';

@Injectable()
export class MyFeatureService extends GlobalService<
  MyFeature,
  MyFeatureDocument
> {
  constructor(
    @InjectModel(MyFeature.name)
    private readonly myFeatureModel: Model<MyFeatureDocument>,
  ) {
    super(myFeatureModel);
  }
}
```

### 3. Using Hashing Utilities

Use the hashing functions for secure password storage and verification.

```typescript
import { hashString, compareHashedString } from 'src/common/hashing';

// Hashing a string
const hashed = await hashString('userPassword123');

// Comparing a string with a hash
const isMatch = await compareHashedString('userPassword123', hashed);
```
