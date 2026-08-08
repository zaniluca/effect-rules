---
name: effect-schema-boundaries
description: Normalize unknown data with Effect Schema. Use when lint flags JSON.parse, double casts, inline object assertions, primitive assertions, Reflect.get, unknown shape probing, or inline Schema compiler calls.
---

# Effect Schema Boundaries

Decode untrusted or loosely typed data once at the boundary. Domain code should
not repeatedly inspect `unknown`.

```ts
const Config = Schema.Struct({
  endpoint: Schema.String,
});

const decodeConfig = Schema.decodeUnknownEffect(Config);
const config = yield * decodeConfig(input);
```

For JSON strings, compose parsing and validation:

```ts
const decodeConfigJson = Schema.decodeUnknownEffect(Schema.fromJsonString(Config));
```

Do not use:

- `JSON.parse(...) as Type`;
- `value as unknown as Type`;
- `value as Record<string, unknown>`;
- inline object assertions;
- repeated `"field" in value` or `Reflect.get` probing.

Hoist `Schema.decode*`, `Schema.encode*`, `Schema.is`, and other compiler
functions outside hot function bodies. The compiled function is reusable:

```ts
const decodeUser = Schema.decodeUnknownEffect(User);

const load = (input: unknown) => decodeUser(input);
```

A named guard is appropriate only when decoding is not the right abstraction
and its return type precisely narrows the value.
