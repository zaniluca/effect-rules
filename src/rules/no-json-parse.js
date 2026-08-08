import { isIdentifier } from "../utils.js";

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Require Effect Schema for JSON parsing.",
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        if (
          node.callee?.type === "MemberExpression" &&
          isIdentifier(node.callee.object, "JSON") &&
          isIdentifier(node.callee.property, "parse")
        ) {
          context.report({
            node,
            message:
              "Parse JSON with Schema.fromJsonString or Schema.parseJson so the boundary is validated. Skill: effect-schema-boundaries.",
          });
        }
      },
    };
  },
};
