import { getPropertyName, isStringLiteral } from "../utils.js";

const isTagProperty = (node) =>
  getPropertyName(node) === "_tag" || (isStringLiteral(node) && node.value === "_tag");

const isTagAccess = (node) => node?.type === "MemberExpression" && isTagProperty(node.property);

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow manual _tag inspection.",
    },
  },
  create(context) {
    return {
      BinaryExpression(node) {
        if (
          (node.operator === "in" && isTagProperty(node.left)) ||
          (["===", "!==", "==", "!="].includes(node.operator) &&
            (isTagAccess(node.left) || isTagAccess(node.right)))
        ) {
          context.report({
            node,
            message:
              "Use Effect.catchTag/catchTags, Predicate.isTagged, Match.valueTags, or the data type's public helpers. Skill: effect-typed-errors.",
          });
        }
      },
    };
  },
};
