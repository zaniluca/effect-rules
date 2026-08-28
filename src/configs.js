export const effectPlugin = {
  name: "effect",
  specifier: "@zaniluca/effect-rules",
};

export const recommendedRules = {
  "effect/no-conditional-tests": "error",
  "effect/no-double-cast": "error",
  "effect/no-effect-internal-tags": "error",
  "effect/no-inline-object-type-assertion": "error",
  "effect/no-inline-schema-compile": "error",
  "effect/no-promise-client-surface": "error",
  "effect/no-promise-reject": "error",
  "effect/no-ts-nocheck": "error",
  "effect/no-vitest-import": "error",
};

export const strictRules = {
  ...recommendedRules,
  "effect/no-effect-internal-tags": "off",
  "effect/no-effect-escape-hatch": "error",
  "effect/no-error-constructor": "error",
  "effect/no-instanceof-error": "error",
  "effect/no-instanceof-tagged-error": "error",
  "effect/no-manual-tag-check": "error",
  "effect/no-match-orelse": "error",
  "effect/no-promise-catch": "error",
  "effect/no-redundant-error-factory": "error",
  "effect/no-redundant-primitive-cast": "error",
  "effect/no-switch-statement": "error",
  "effect/no-try-catch-or-throw": "error",
  "effect/no-unknown-error-message": "error",
  "effect/no-unknown-shape-probing": "error",
  "effect/prefer-effect-predicate": "error",
  "effect/prefer-schema-inferred-types": "error",
};

export const boundaryRules = {
  "effect/no-error-constructor": "off",
  "effect/no-instanceof-error": "off",
  "effect/no-promise-catch": "off",
  "effect/no-promise-reject": "off",
  "effect/no-try-catch-or-throw": "off",
  "effect/no-unknown-error-message": "off",
};

export const recommendedConfig = {
  jsPlugins: [effectPlugin],
  rules: recommendedRules,
};

export const strictConfig = {
  jsPlugins: [effectPlugin],
  rules: strictRules,
};
