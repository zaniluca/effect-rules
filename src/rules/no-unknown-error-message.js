import {
  getCallName,
  getPropertyName,
  isIdentifier,
  nodeName,
  unwrapExpression,
} from "../utils.js";

const errorLikeNames = new Set(["cause", "e", "err", "error", "reason", "unknownError"]);

const isErrorLikeIdentifier = (node) => errorLikeNames.has(nodeName(unwrapExpression(node)));

const isCatchTagHandler = (node) => {
  if (node?.type !== "ArrowFunctionExpression" && node?.type !== "FunctionExpression") {
    return false;
  }
  const parent = node.parent;
  if (
    parent?.type === "CallExpression" &&
    parent.arguments?.[1] === node &&
    getCallName(parent.callee) === "catchTag"
  ) {
    return true;
  }
  const objectExpression = parent?.type === "Property" ? parent.parent : undefined;
  const callExpression =
    objectExpression?.type === "ObjectExpression" ? objectExpression.parent : undefined;
  return (
    callExpression?.type === "CallExpression" && getCallName(callExpression.callee) === "catchTags"
  );
};

const isTypedCatchTagParameter = (node) => {
  const name = nodeName(unwrapExpression(node));
  if (name === undefined) {
    return false;
  }
  let current = node.parent;
  while (current !== undefined && current !== null) {
    if (current.type === "ArrowFunctionExpression" || current.type === "FunctionExpression") {
      return isCatchTagHandler(current) && nodeName(current.params?.[0]) === name;
    }
    current = current.parent;
  }
  return false;
};

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow deriving product messages from unknown errors.",
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        if (
          isIdentifier(unwrapExpression(node.callee), "String") &&
          node.arguments.some(isErrorLikeIdentifier)
        ) {
          context.report({
            node,
            message:
              "Do not stringify unknown errors. Preserve the cause and use a stable domain message. Skill: effect-typed-errors.",
          });
        }
      },
      MemberExpression(node) {
        if (
          getPropertyName(node.property) === "message" &&
          isErrorLikeIdentifier(node.object) &&
          !isTypedCatchTagParameter(node.object)
        ) {
          context.report({
            node,
            message:
              "Do not read .message from an unknown error. Normalize it at a typed boundary. Skill: effect-typed-errors.",
          });
        }
      },
      VariableDeclarator(node) {
        if (
          node.id?.type !== "ObjectPattern" ||
          !isErrorLikeIdentifier(node.init) ||
          isTypedCatchTagParameter(node.init)
        ) {
          return;
        }
        for (const property of node.id.properties ?? []) {
          if (property.type === "Property" && getPropertyName(property.key) === "message") {
            context.report({
              node: property,
              message:
                "Do not destructure .message from an unknown error. Normalize it at a typed boundary. Skill: effect-typed-errors.",
            });
          }
        }
      },
    };
  },
};
