# @zaniluca/effect-rules

Oxlint rules for enforcing Effect conventions, with companion remediation
skills that help apply the recommended fixes.

## Oxlint plugin

Install Oxlint and the plugin together:

```bash
pnpm add -D oxlint @zaniluca/effect-rules
```

Use a TypeScript config and extend one of the exported presets:

```ts
import { recommendedConfig } from "@zaniluca/effect-rules/configs";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [recommendedConfig],
});
```

`recommendedConfig` enables high-confidence correctness and boundary rules.
`strictConfig` includes every rule and adds opinionated Effect-first
architectural policies:

```ts
import { boundaryRules, strictConfig } from "@zaniluca/effect-rules/configs";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [strictConfig],
  overrides: [
    {
      files: ["src/adapters/**/*.ts"],
      rules: boundaryRules,
    },
  ],
});
```

The `boundaryRules` override disables rules that legitimate runtime adapters
may need to cross when translating exceptions, Promises, `fetch`, or unknown
failures into Effect. Keep overrides narrow and documented.

You can also import `recommendedRules`, `strictRules`, `boundaryRules`, and
`effectPlugin` individually from `@zaniluca/effect-rules/configs`.

## Agent skills

Skills are installed separately from GitHub:

```bash
npx skills add zaniluca/effect-rules
```

Each diagnostic points to the relevant remediation skill. Rule authors should
start with `effect-rules-authoring`.

## Releasing

Preview the release checks and operations without changing GitHub:

```bash
pnpm run release --dry-run
```

Create the tag matching `package.json` and publish the GitHub Release:

```bash
pnpm run release
```

The script only accepts stable `X.Y.Z` versions, requires a clean and fully
pushed branch, runs `pnpm check`, and asks for the expected tag as confirmation.
Publishing the GitHub Release triggers the npm publish workflow.

## Rules

| Rule                              | Preset      | Purpose                                                                 |
| --------------------------------- | ----------- | ----------------------------------------------------------------------- |
| `no-conditional-tests`            | Recommended | Disallow conditional assertions inside tests.                           |
| `no-double-cast`                  | Recommended | Disallow double casts through unknown or any.                           |
| `no-effect-escape-hatch`          | Strict      | Disallow Effect defect escape hatches outside tests.                    |
| `no-effect-internal-tags`         | Recommended | Disallow direct tag checks for Effect-owned data types.                 |
| `no-error-constructor`            | Strict      | Disallow built-in Error constructors in Effect domain code.             |
| `no-inline-object-type-assertion` | Recommended | Disallow assertions against inline object-shaped types.                 |
| `no-inline-schema-compile`        | Recommended | Require compiled Schema functions to be hoisted out of function bodies. |
| `no-instanceof-error`             | Strict      | Disallow `instanceof Error` checks in Effect domain code.               |
| `no-instanceof-tagged-error`      | Strict      | Disallow `instanceof` checks for tagged errors.                         |
| `no-json-parse`                   | Recommended | Require Effect Schema for JSON parsing.                                 |
| `no-manual-tag-check`             | Strict      | Disallow manual `_tag` inspection.                                      |
| `no-match-orelse`                 | Strict      | Require exhaustive Effect Match chains.                                 |
| `no-promise-catch`                | Strict      | Disallow Promise-style catch calls in Effect domain code.               |
| `no-promise-client-surface`       | Recommended | Disallow Promise-returning methods on Effect client interfaces.         |
| `no-promise-reject`               | Recommended | Disallow Promise rejection APIs in Effect domain code.                  |
| `no-raw-fetch`                    | Recommended | Require Effect HttpClient instead of ambient `fetch`.                   |
| `no-redundant-error-factory`      | Strict      | Disallow helpers that only construct one tagged error.                  |
| `no-redundant-primitive-cast`     | Strict      | Disallow suspicious primitive assertions.                               |
| `no-switch-statement`             | Strict      | Prefer Effect Match over JavaScript switch statements.                  |
| `no-try-catch-or-throw`           | Strict      | Disallow try/catch and throw in Effect domain code.                     |
| `no-ts-nocheck`                   | Recommended | Disallow `@ts-nocheck` directives.                                      |
| `no-unknown-error-message`        | Strict      | Disallow deriving product messages from unknown errors.                 |
| `no-unknown-shape-probing`        | Strict      | Disallow ad hoc probing of unknown object shapes.                       |
| `no-vitest-import`                | Recommended | Require Effect tests to import from `@effect/vitest`.                   |
| `prefer-effect-predicate`         | Strict      | Prefer Effect Predicate nullish helpers.                                |
| `prefer-schema-inferred-types`    | Strict      | Require object types to be inferred from nearby Effect Schemas.         |
| `prefer-yield-tagged-error`       | Recommended | Prefer yielding tagged errors directly inside Effect generators.        |

## Attribution

The rules and skills were adapted from
[UsefulSoftwareCo/executor](https://github.com/UsefulSoftwareCo/executor).

This project is distributed under the [MIT License](LICENSE).
