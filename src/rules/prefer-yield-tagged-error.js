import { getPropertyName, isIdentifier } from "../utils.js";

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Prefer yielding tagged errors directly inside Effect generators.",
    },
  },
  create(context) {
    return {
      YieldExpression(node) {
        const argument = node.argument;
        const constructedError = argument?.arguments?.[0];
        if (
          node.delegate === true &&
          argument?.type === "CallExpression" &&
          argument.callee?.type === "MemberExpression" &&
          isIdentifier(argument.callee.object, "Effect") &&
          getPropertyName(argument.callee.property) === "fail" &&
          constructedError?.type === "NewExpression" &&
          isIdentifier(constructedError.callee) &&
          constructedError.callee.name !== "Error" &&
          constructedError.callee.name.endsWith("Error")
        ) {
          context.report({
            node,
            message:
              "Yield the tagged error directly inside Effect.gen or Effect.fn. Skill: effect-typed-errors.",
          });
        }
      },
    };
  },
};
