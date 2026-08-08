import { isIdentifier } from "../utils.js";

const parameterName = (parameter) => {
  if (isIdentifier(parameter)) {
    return parameter.name;
  }
  if (parameter?.type === "AssignmentPattern" && isIdentifier(parameter.left)) {
    return parameter.left.name;
  }
  return undefined;
};

const isForwardedValue = (node, parameterNames) =>
  node?.type === "Literal" ||
  node?.type === "StringLiteral" ||
  (node?.type === "Identifier" && parameterNames.has(node.name)) ||
  (node?.type === "MemberExpression" &&
    isIdentifier(node.object) &&
    parameterNames.has(node.object.name));

const isRedundantConstruction = (node, parameterNames) => {
  if (
    node?.type !== "NewExpression" ||
    !isIdentifier(node.callee) ||
    !node.callee.name.endsWith("Error")
  ) {
    return false;
  }
  const argument = node.arguments?.[0];
  if (argument === undefined) {
    return true;
  }
  if (isIdentifier(argument)) {
    return parameterNames.has(argument.name);
  }
  return (
    argument.type === "ObjectExpression" &&
    argument.properties.every(
      (property) =>
        property.type !== "SpreadElement" && isForwardedValue(property.value, parameterNames),
    )
  );
};

const returnsOnlyError = (node) => {
  const parameterNames = new Set((node.params ?? []).map(parameterName).filter(Boolean));
  if (isRedundantConstruction(node.body, parameterNames)) {
    return true;
  }
  return (
    node.body?.type === "BlockStatement" &&
    node.body.body.length === 1 &&
    node.body.body[0]?.type === "ReturnStatement" &&
    isRedundantConstruction(node.body.body[0].argument, parameterNames)
  );
};

const isErrorHelperName = (name) =>
  /^make[A-Z].*Error$/.test(name ?? "") || name?.endsWith("Error");

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow helpers that only construct one tagged error.",
    },
  },
  create(context) {
    const report = (name, functionNode, reportNode) => {
      if (isErrorHelperName(name) && returnsOnlyError(functionNode)) {
        context.report({
          node: reportNode,
          message:
            "Construct the tagged error at the failure site unless the helper performs real classification or normalization. Skill: effect-typed-errors.",
        });
      }
    };

    return {
      FunctionDeclaration(node) {
        report(node.id?.name, node, node);
      },
      VariableDeclarator(node) {
        if (
          isIdentifier(node.id) &&
          (node.init?.type === "ArrowFunctionExpression" ||
            node.init?.type === "FunctionExpression")
        ) {
          report(node.id.name, node.init, node);
        }
      },
    };
  },
};
