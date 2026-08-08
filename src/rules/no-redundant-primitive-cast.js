import { isConfigOrTooling, unwrapExpression } from "../utils.js";

const primitiveTypes = new Set(["TSStringKeyword", "TSNumberKeyword", "TSBooleanKeyword"]);

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow suspicious primitive assertions.",
    },
  },
  create(context) {
    if (isConfigOrTooling(context.filename)) {
      return {};
    }

    const check = (node) => {
      const expression = unwrapExpression(node.expression);
      if (
        primitiveTypes.has(node.typeAnnotation?.type) &&
        (expression?.type === "Identifier" || expression?.type === "MemberExpression")
      ) {
        context.report({
          node,
          message:
            "Remove the primitive assertion or normalize unknown input with Schema at its boundary. Skill: effect-schema-boundaries.",
        });
      }
    };

    return {
      TSAsExpression: check,
      TSTypeAssertion: check,
    };
  },
};
