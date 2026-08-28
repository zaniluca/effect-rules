import noConditionalTests from "./rules/no-conditional-tests.js";
import noDoubleCast from "./rules/no-double-cast.js";
import noEffectEscapeHatch from "./rules/no-effect-escape-hatch.js";
import noEffectInternalTags from "./rules/no-effect-internal-tags.js";
import noErrorConstructor from "./rules/no-error-constructor.js";
import noInlineObjectTypeAssertion from "./rules/no-inline-object-type-assertion.js";
import noInlineSchemaCompile from "./rules/no-inline-schema-compile.js";
import noInstanceofError from "./rules/no-instanceof-error.js";
import noInstanceofTaggedError from "./rules/no-instanceof-tagged-error.js";
import noManualTagCheck from "./rules/no-manual-tag-check.js";
import noMatchOrElse from "./rules/no-match-orelse.js";
import noPromiseCatch from "./rules/no-promise-catch.js";
import noPromiseClientSurface from "./rules/no-promise-client-surface.js";
import noPromiseReject from "./rules/no-promise-reject.js";
import noRedundantErrorFactory from "./rules/no-redundant-error-factory.js";
import noRedundantPrimitiveCast from "./rules/no-redundant-primitive-cast.js";
import noSwitchStatement from "./rules/no-switch-statement.js";
import noTryCatchOrThrow from "./rules/no-try-catch-or-throw.js";
import noTsNocheck from "./rules/no-ts-nocheck.js";
import noUnknownErrorMessage from "./rules/no-unknown-error-message.js";
import noUnknownShapeProbing from "./rules/no-unknown-shape-probing.js";
import noVitestImport from "./rules/no-vitest-import.js";
import preferEffectPredicate from "./rules/prefer-effect-predicate.js";
import preferSchemaInferredTypes from "./rules/prefer-schema-inferred-types.js";

export default {
  meta: {
    name: "@zaniluca/effect-rules",
  },
  rules: {
    "no-conditional-tests": noConditionalTests,
    "no-double-cast": noDoubleCast,
    "no-effect-escape-hatch": noEffectEscapeHatch,
    "no-effect-internal-tags": noEffectInternalTags,
    "no-error-constructor": noErrorConstructor,
    "no-inline-object-type-assertion": noInlineObjectTypeAssertion,
    "no-inline-schema-compile": noInlineSchemaCompile,
    "no-instanceof-error": noInstanceofError,
    "no-instanceof-tagged-error": noInstanceofTaggedError,
    "no-manual-tag-check": noManualTagCheck,
    "no-match-orelse": noMatchOrElse,
    "no-promise-catch": noPromiseCatch,
    "no-promise-client-surface": noPromiseClientSurface,
    "no-promise-reject": noPromiseReject,
    "no-redundant-error-factory": noRedundantErrorFactory,
    "no-redundant-primitive-cast": noRedundantPrimitiveCast,
    "no-switch-statement": noSwitchStatement,
    "no-try-catch-or-throw": noTryCatchOrThrow,
    "no-ts-nocheck": noTsNocheck,
    "no-unknown-error-message": noUnknownErrorMessage,
    "no-unknown-shape-probing": noUnknownShapeProbing,
    "no-vitest-import": noVitestImport,
    "prefer-effect-predicate": preferEffectPredicate,
    "prefer-schema-inferred-types": preferSchemaInferredTypes,
  },
};
