---
name: effect-match
description: Replace manual tag checks, switch statements, and Match.orElse fallbacks with exhaustive Effect Match expressions.
---

# Effect Match

Use `Match.valueTags` for tagged unions when each tag maps directly:

```ts
Match.valueTags(error, {
  NotFound: handleNotFound,
  InvalidInput: handleInvalidInput,
});
```

For richer matching, start with `Match.value(value)` and finish with
`Match.exhaustive`. This makes newly added union members a type error.

Use `Match.option` when absence is an intentional result and
`Match.orElseAbsurd` when the remaining case is statically impossible.
Avoid `Match.orElse` as a convenience fallback because it hides missing cases.
