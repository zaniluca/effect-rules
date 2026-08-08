---
name: effect-client-boundaries
description: Wrap callback- and Promise-based third-party clients behind Effect services. Use when lint flags Promise-returning client interfaces, Promise.reject, Promise catch, or raw async error handling.
---

# Effect Client Boundaries

Wrap foreign asynchronous APIs at one adapter boundary and expose named Effect
operations:

```ts
export interface PaymentsClient {
  readonly listTransactions: (
    accountId: AccountId,
  ) => Effect.Effect<ReadonlyArray<Transaction>, PaymentsClientError>;
}
```

Use `Effect.tryPromise` for Promise APIs and `Effect.callback` for callback
APIs. Classify errors while entering Effect, preserving the original value in a
typed error cause.

Prefer named operations over a generic `use(client => ...)` method. Named
operations keep the raw SDK private and allow semantic errors, spans, retries,
rate limits, and tests to evolve without leaking the vendor API.
