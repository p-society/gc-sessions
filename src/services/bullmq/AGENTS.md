# BullMQ Service Overview

## OVERVIEW

This service manages asynchronous job processing using BullMQ and Redis. It allows the application to offload heavy or time-delayed tasks—such as sending emails or processing real-time streams—ensuring the main application remains responsive.

## STRUCTURE

- `jobs/`: Contains TypeScript interfaces/types that define the shape of job data.
- `processors/`: Contains the worker logic (consumers) that execute the actual tasks.
- `producers/`: Contains services responsible for adding (producing) jobs into the queues.
- `constants/`: Centralized location for queue names and key generation logic.

## WHERE TO LOOK

- `queue.module.ts`: The entry point where queues, processors, and producers are registered globally.
- `constants/queues.ts`: The source of truth for all queue name constants.
- `processors/otp.processor.ts`: A reference implementation for job consumption and external service integration.
- `producers/otp.producer.ts`: A reference implementation for job production.

## CONVENTIONS

### 1. Defining a Job

Always define a job's data structure in the `jobs/` directory to ensure type safety across producers and processors.

```typescript
export interface OtpJob {
  email: string;
}
```

### 2. Producing a Job

Producers should inject the specific queue using `@InjectQueue(NAME)` and provide high-level methods for adding jobs.

```typescript
@Injectable()
export class OtpProducer {
  constructor(@InjectQueue(OTP_QUEUE) private otpQueue: Queue) {}
  async push(data: OtpJob) {
    await this.otpQueue.add('send-otp', data);
  }
}
```

### 3. Processing a Job

Processors must extend `WorkerHost` and use the `@Processor(NAME)` decorator. The `process` method should handle the job logic and provide appropriate error handling.

```typescript
@Processor(OTP_QUEUE)
export class OtpQueueProcessor extends WorkerHost {
  async process(job: Job<OtpJob>) {
    const { email } = job.data;
    // Implementation logic here
  }
}
```
