import { isIdentifier } from "../utils.js";

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Require exhaustive Effect Match chains.",
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        if (
          node.callee?.type === "MemberExpression" &&
          isIdentifier(node.callee.object, "Match") &&
          isIdentifier(node.callee.property, "orElse")
        ) {
          context.report({
            node,
            message:
              "Finish Match with Match.exhaustive, Match.option, or Match.orElseAbsurd instead of a catch-all fallback. Skill: effect-match.",
          });
        }
      },
    };
  },
};
