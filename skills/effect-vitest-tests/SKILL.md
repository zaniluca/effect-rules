---
name: effect-vitest-tests
description: Keep Effect tests deterministic and Effect-aware. Use when lint flags direct vitest imports or conditional assertions, or when tests need layers, TestClock, scoped resources, or Effect programs.
---

# Effect Vitest Tests

Import test APIs from `@effect/vitest`. Use `it.effect` for normal Effect
tests and `it.live` only when live runtime services are required.

```ts
import { describe, expect, it, layer } from "@effect/vitest";
```

Use `layer(...)` when several tests share a layer. Use separate `it.layer(...)`
blocks when each test needs an isolated layer instance. Avoid repeatedly
calling `Effect.provide` inside test bodies.

`it.effect` provides deterministic test services such as `TestClock`. Advance
time with `TestClock.adjust` rather than sleeping in tests.

Do not hide assertions behind `if`, ternaries, logical operators, or switches.
Assert the complete discriminated result or split the cases into separate
tests.

Test behavior and public contracts. Prefer real in-memory HTTP handlers or
Effect test layers over patching globals.
