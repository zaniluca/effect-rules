import { getPropertyName, isDeclarationFile, isIdentifier, unwrapExpression } from "../utils.js";

const isGlobalFetch = (node) => {
  const expression = unwrapExpression(node);
  if (isIdentifier(expression, "fetch")) {
    return true;
  }
  if (expression?.type !== "MemberExpression" || getPropertyName(expression.property) !== "fetch") {
    return false;
  }
  const object = unwrapExpression(expression.object);
  return (
    isIdentifier(object, "globalThis") ||
    isIdentifier(object, "window") ||
    isIdentifier(object, "self")
  );
};

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Require Effect HttpClient instead of ambient fetch.",
    },
  },
  create(context) {
    if (isDeclarationFile(context.filename)) {
      return {};
    }

    return {
      CallExpression(node) {
        if (isGlobalFetch(node.callee)) {
          context.report({
            node: node.callee,
            message:
              "Route HTTP through Effect HttpClient or an explicit adapter boundary. Skill: effect-http-client-boundary.",
          });
        }
      },
      MemberExpression(node) {
        if (node.parent?.type !== "CallExpression" && isGlobalFetch(node)) {
          context.report({
            node,
            message:
              "Do not expose ambient fetch as a dependency. Adapt Effect HttpClient at the owning boundary. Skill: effect-http-client-boundary.",
          });
        }
      },
    };
  },
};
