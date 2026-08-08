import { isConfigOrTooling } from "../utils.js";

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Require Effect tests to import from @effect/vitest.",
    },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value === "vitest" && !isConfigOrTooling(context.filename)) {
          context.report({
            node: node.source,
            message:
              "Import test helpers from @effect/vitest or @effect/vitest/utils. Skill: effect-vitest-tests.",
          });
        }
      },
    };
  },
};
