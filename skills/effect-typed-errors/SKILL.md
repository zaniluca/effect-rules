---
name: effect-typed-errors
description: Fix JavaScript-style error handling in Effect code. Use when lint flags Error constructors, throw, try/catch, Promise catch/reject, instanceof Error, manual _tag checks, unknown error messages, or Effect die/orDie escape hatches.
---

# Effect Typed Errors

Keep expected failures in the `E` channel and reserve defects for broken
invariants.

## Workflow

1. Identify whether the code is domain logic or a real runtime/adapter boundary.
2. Reuse nearby domain errors before defining another error.
3. Add a distinct tagged error only when callers have a distinct recovery,
   status, retry, UI, or telemetry path.
4. Preserve the original foreign failure in `cause: Schema.Defect()` when useful.
5. Translate errors once at the owning boundary.

Prefer `Schema.TaggedErrorClass` for schema-shaped errors and
`Data.TaggedError` for intentionally local, non-serializable failures.

Inside `Effect.gen` and `Effect.fn`, yield yieldable errors directly:

```ts
return yield * new UserNotFoundError({ userId });
```

Use `Effect.fail` in combinator callbacks:

```ts
Effect.flatMap(user, (value) =>
  value === undefined ? Effect.fail(new UserNotFoundError({ userId })) : Effect.succeed(value),
);
```

Wrap Promise APIs once:

```ts
Effect.tryPromise({
  try: () => client.load(id),
  catch: (cause) => new ClientRequestError({ operation: "load", cause }),
});
```

Handle tagged errors through `Effect.catchTag`, `Effect.catchTags`,
`Predicate.isTagged`, or `Match.valueTags`. Do not inspect `_tag` manually.

Use `Effect.die` or `Effect.orDie` only when the failure is genuinely an
unrecoverable invariant at a runtime boundary. A typed failure that becomes an
HTTP 500 is still normally translated explicitly so observability and the wire
contract remain visible in the type.

At unavoidable third-party, process, or callback boundaries, keep the
JavaScript error behavior contained and use a narrow lint suppression whose
reason begins with `boundary:`.
