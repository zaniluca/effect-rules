# Effect Rules

This repository publishes `@zaniluca/effect-rules`, an Oxlint JavaScript plugin
and a collection of remediation skills for Effect codebases.

## Rule Changes

- Keep rules repository-agnostic. File-name conventions may be configurable,
  but rules must not contain application package names or internal paths.
- Diagnostics must explain the preferred Effect replacement and name the
  remediation skill when one exists.
- Put high-confidence correctness and boundary rules in `recommendedRules`.
  Keep genuinely enforceable architectural policies in `strictRules`.
- JavaScript plugins do not have TypeScript type information. Prefer precise
  syntax checks and avoid rules whose correctness depends on inferred types.
- Do not add rules that contradict the official `Effect-TS/skills` guidance.

## Verification

From the repository root:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm fmt:check
pnpm pack:check
```

Read `skills/effect-rules-authoring/SKILL.md` before adding or broadening a
rule.
