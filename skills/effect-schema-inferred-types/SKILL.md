---
name: effect-schema-inferred-types
description: Remove TypeScript object shapes duplicated next to Effect Schemas. Use when lint reports a manual interface or type alias that mirrors a nearby Schema definition.
---

# Schema-Inferred Types

When a Schema owns a runtime shape, derive the static type from it:

```ts
export const User = Schema.Struct({
  id: UserId,
  email: Schema.String,
});

export type User = typeof User.Type;
```

Keep exported type names stable while replacing duplicated interfaces.

Do not replace a deliberate domain type when the Schema represents a different
encoded transport shape. In that case, model the relationship with
`Schema.decodeTo`, a field transformation, or a clearly named boundary schema.

Branded scalar types and private recursive helper interfaces used only for
`Schema.suspend` are not duplicate object models.
