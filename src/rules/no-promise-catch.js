import { getPropertyName, isIdentifier, unwrapExpression } from "../utils.js";

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow Promise-style catch calls in Effect domain code.",
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        const callee = unwrapExpression(node.callee);
        if (
          callee?.type === "MemberExpression" &&
          getPropertyName(callee.property) === "catch" &&
          !isIdentifier(unwrapExpression(callee.object), "Effect")
        ) {
          context.report({
            node,
            message:
              "Wrap Promise failures with Effect.tryPromise and keep them in the typed error channel. Skill: effect-typed-errors.",
          });
        }
      },
    };
  },
};
