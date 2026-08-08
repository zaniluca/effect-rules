import { getPropertyName, isTestLike, unwrapExpression } from "../utils.js";

const escapeHatches = new Set(["die", "dieMessage", "orDie", "orDieWith"]);

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow Effect defect escape hatches outside tests.",
    },
  },
  create(context) {
    if (isTestLike(context.filename)) {
      return {};
    }

    return {
      MemberExpression(node) {
        const expression = unwrapExpression(node);
        if (
          expression?.type === "MemberExpression" &&
          escapeHatches.has(getPropertyName(expression.property))
        ) {
          context.report({
            node,
            message:
              "Keep expected failures in the typed error channel. Use die/orDie only at a documented runtime boundary. Skill: effect-typed-errors.",
          });
        }
      },
    };
  },
};
