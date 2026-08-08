import { nodeName } from "../utils.js";

const errorConstructors = new Set([
  "AggregateError",
  "Error",
  "EvalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError",
]);

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow built-in Error constructors in Effect domain code.",
    },
  },
  create(context) {
    const check = (node) => {
      if (errorConstructors.has(nodeName(node.callee))) {
        context.report({
          node,
          message:
            "Use a typed Effect error. Keep built-in Error construction inside explicit adapter or runtime boundaries. Skill: effect-typed-errors.",
        });
      }
    };

    return {
      NewExpression: check,
      CallExpression: check,
    };
  },
};
