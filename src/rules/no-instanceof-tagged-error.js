import { isIdentifier, nodeName } from "../utils.js";

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow instanceof checks for tagged errors.",
    },
  },
  create(context) {
    return {
      BinaryExpression(node) {
        const rightName = nodeName(node.right);
        if (
          node.operator === "instanceof" &&
          isIdentifier(node.right) &&
          rightName !== "Error" &&
          rightName?.endsWith("Error")
        ) {
          context.report({
            node,
            message:
              "Use Effect.catchTag, Effect.catchTags, or Predicate.isTagged for tagged errors. Skill: effect-typed-errors.",
          });
        }
      },
    };
  },
};
