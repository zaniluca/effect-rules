import { getPropertyName, isIdentifier, unwrapExpression } from "../utils.js";

const compilerMethods = new Set([
  "is",
  "asserts",
  "decode",
  "decodeSync",
  "decodePromise",
  "decodeOption",
  "decodeEither",
  "decodeUnknown",
  "decodeUnknownSync",
  "decodeUnknownPromise",
  "decodeUnknownOption",
  "decodeUnknownEither",
  "encode",
  "encodeSync",
  "encodePromise",
  "encodeOption",
  "encodeEither",
  "encodeUnknown",
  "encodeUnknownSync",
  "encodeUnknownPromise",
  "encodeUnknownOption",
  "encodeUnknownEither",
  "validate",
  "validateSync",
  "validatePromise",
  "validateOption",
  "validateEither",
  "parse",
  "parseSync",
  "parsePromise",
  "parseOption",
  "parseEither",
]);

const schemaCompilerMethod = (callee) => {
  const expression = unwrapExpression(callee);
  if (expression?.type !== "MemberExpression") {
    return undefined;
  }
  const object = unwrapExpression(expression.object);
  const method = getPropertyName(expression.property);
  return isIdentifier(object, "Schema") && compilerMethods.has(method) ? method : undefined;
};

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Require compiled Schema functions to be hoisted out of function bodies.",
    },
  },
  create(context) {
    let functionDepth = 0;
    const enterFunction = () => {
      functionDepth++;
    };
    const exitFunction = () => {
      functionDepth--;
    };

    return {
      FunctionDeclaration: enterFunction,
      "FunctionDeclaration:exit": exitFunction,
      FunctionExpression: enterFunction,
      "FunctionExpression:exit": exitFunction,
      ArrowFunctionExpression: enterFunction,
      "ArrowFunctionExpression:exit": exitFunction,
      CallExpression(node) {
        if (functionDepth === 0) {
          return;
        }
        const method = schemaCompilerMethod(node.callee);
        if (method !== undefined) {
          context.report({
            node: node.callee,
            message: `Hoist Schema.${method}(...) outside the function so its compiled parser is reused. Skill: effect-schema-boundaries.`,
          });
        }
      },
    };
  },
};
