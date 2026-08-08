import { isIdentifier, isStringLiteral } from "../utils.js";

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow ad hoc probing of unknown object shapes.",
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        if (
          node.callee?.type === "MemberExpression" &&
          isIdentifier(node.callee.object, "Reflect") &&
          isIdentifier(node.callee.property, "get")
        ) {
          context.report({
            node,
            message:
              "Decode unknown input with Schema or a named typed adapter before inspecting it. Skill: effect-schema-boundaries.",
          });
        }
      },
      BinaryExpression(node) {
        if (node.operator === "in" && isStringLiteral(node.left)) {
          context.report({
            node,
            message:
              "Decode unknown input with Schema or a named typed guard instead of probing fields. Skill: effect-schema-boundaries.",
          });
        }
      },
    };
  },
};
