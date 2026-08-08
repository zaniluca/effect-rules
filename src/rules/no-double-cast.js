import { isConfigOrTooling } from "../utils.js";

const allowMarker = "effect-rules-allow-double-cast:";

const hasAllowReason = (comment) => {
  const index = comment?.value.indexOf(allowMarker) ?? -1;
  return index >= 0 && comment.value.slice(index + allowMarker.length).trim().length > 0;
};

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow double casts through unknown or any.",
    },
  },
  create(context) {
    if (isConfigOrTooling(context.filename)) {
      return {};
    }

    return {
      TSAsExpression(node) {
        if (node.expression?.type !== "TSAsExpression") {
          return;
        }
        const innerType = node.expression.typeAnnotation?.type;
        if (innerType !== "TSUnknownKeyword" && innerType !== "TSAnyKeyword") {
          return;
        }

        const comments = context.sourceCode.getCommentsBefore(node);
        if (comments.some(hasAllowReason)) {
          return;
        }

        context.report({
          node,
          message:
            "Avoid double casts through unknown or any. Decode with Schema, introduce a typed adapter, or add a narrow allow comment with a reason. Skill: effect-schema-boundaries.",
        });
      },
    };
  },
};
