---
name: effect-rules-authoring
description: Add or refine an Oxlint JavaScript rule for Effect without coupling it to one repository. Use when developing @zaniluca/effect-rules, changing presets, or evaluating a candidate rule from another codebase.
---

# Effect Rule Authoring

Start from a concrete failure mode, not a stylistic preference.

1. Confirm the preferred replacement exists in the pinned Effect API.
2. Decide whether the rule is broadly correct, an Effect-first architectural
   policy, or application-specific.
3. Keep broadly correct rules in `recommendedRules`, opinionated policies in
   `strictRules`, and application-specific rules outside this package.
4. Implement the narrowest reliable ESTree check. Oxlint JavaScript plugins do
   not provide TypeScript type information.
5. Add an invalid fixture and important valid exceptions.
6. Include the replacement and remediation skill in the diagnostic.

Avoid path allowlists, package names, provider names, generated-code knowledge,
and checks that infer semantic types from identifier names alone. When a true
adapter boundary must use JavaScript exceptions, Promises, or `fetch`, prefer a
scoped configuration override or a narrow suppression with a `boundary:`
reason.

Before broadening a selector, run it against the API playground and inspect
every finding. A rule that needs frequent false-positive suppression belongs in
`strictRules`, needs options, or should not be shipped.
