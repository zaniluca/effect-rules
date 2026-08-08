import { nodeName } from "../utils.js";

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow instanceof Error checks in Effect domain code.",
    },
  },
  create(context) {
    return {
      BinaryExpression(node) {
        if (node.operator === "instanceof" && nodeName(node.right) === "Error") {
          context.report({
            node,
            message:
              "Preserve typed failures instead of narrowing unknown values with instanceof Error. Skill: effect-typed-errors.",
          });
        }
      },
    };
  },
};
