import { getPropertyName, isIdentifier, unwrapExpression } from "../utils.js";

const isNullishLiteral = (node) =>
  (node?.type === "Literal" && node.value === null) || isIdentifier(node, "undefined");

const isNullishPredicate = (node) => {
  if (node?.params?.length !== 1 || !isIdentifier(unwrapExpression(node.params[0]))) {
    return false;
  }
  const name = unwrapExpression(node.params[0]).name;
  const body = unwrapExpression(node.body);
  if (body?.type !== "BinaryExpression" || !["!==", "!=", "===", "=="].includes(body.operator)) {
    return false;
  }
  const left = unwrapExpression(body.left);
  const right = unwrapExpression(body.right);
  return (
    (isIdentifier(left, name) && isNullishLiteral(right)) ||
    (isIdentifier(right, name) && isNullishLiteral(left))
  );
};

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Prefer Effect Predicate nullish helpers.",
    },
  },
  create(context) {
    let importsEffect = false;

    return {
      ImportDeclaration(node) {
        importsEffect ||= node.source.value === "effect";
      },
      VariableDeclarator(node) {
        const initializer = unwrapExpression(node.init);
        if (
          importsEffect &&
          initializer?.type === "ArrowFunctionExpression" &&
          isNullishPredicate(initializer)
        ) {
          context.report({
            node: initializer,
            message:
              "Use Predicate.isNotNull, Predicate.isNotUndefined, or Predicate.isNotNullish.",
          });
        }
      },
      CallExpression(node) {
        const callee = unwrapExpression(node.callee);
        const predicate = unwrapExpression(node.arguments?.[0]);
        if (
          importsEffect &&
          callee?.type === "MemberExpression" &&
          getPropertyName(callee.property) === "filter" &&
          (predicate?.type === "ArrowFunctionExpression" ||
            predicate?.type === "FunctionExpression") &&
          isNullishPredicate(predicate)
        ) {
          context.report({
            node: predicate,
            message:
              "Use Predicate.isNotNull, Predicate.isNotUndefined, or Predicate.isNotNullish.",
          });
        }
      },
    };
  },
};
