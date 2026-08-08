import { getPropertyName, isIdentifier, unwrapExpression } from "../utils.js";

const isPromiseReject = (node) => {
  const expression = unwrapExpression(node);
  return (
    expression?.type === "MemberExpression" &&
    isIdentifier(unwrapExpression(expression.object), "Promise") &&
    getPropertyName(expression.property) === "reject"
  );
};

const isFunction = (node) =>
  node?.type === "ArrowFunctionExpression" ||
  node?.type === "FunctionExpression" ||
  node?.type === "FunctionDeclaration";

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow Promise rejection APIs in Effect domain code.",
    },
  },
  create(context) {
    const promiseExecutors = new WeakSet();
    const rejectNames = [];

    const enterFunction = (node) => {
      if (promiseExecutors.has(node)) {
        rejectNames.push(isIdentifier(node.params?.[1]) ? node.params[1].name : undefined);
      }
    };
    const exitFunction = (node) => {
      if (promiseExecutors.has(node)) {
        rejectNames.pop();
      }
    };

    return {
      NewExpression(node) {
        if (isIdentifier(unwrapExpression(node.callee), "Promise")) {
          const executor = node.arguments?.[0];
          if (isFunction(executor)) {
            promiseExecutors.add(executor);
          }
        }
      },
      CallExpression(node) {
        if (
          isPromiseReject(node.callee) ||
          (isIdentifier(node.callee) && rejectNames.includes(node.callee.name))
        ) {
          context.report({
            node,
            message:
              "Use Effect.fail, Effect.callback, or Effect.tryPromise instead of Promise rejection. Skill: effect-client-boundaries.",
          });
        }
      },
      FunctionDeclaration: enterFunction,
      "FunctionDeclaration:exit": exitFunction,
      FunctionExpression: enterFunction,
      "FunctionExpression:exit": exitFunction,
      ArrowFunctionExpression: enterFunction,
      "ArrowFunctionExpression:exit": exitFunction,
    };
  },
};
