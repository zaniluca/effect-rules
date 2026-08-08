import { getCallName, isTestLike } from "../utils.js";

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow conditional assertions inside tests.",
    },
  },
  create(context) {
    if (!isTestLike(context.filename)) {
      return {};
    }

    let conditionalDepth = 0;
    const enterConditional = () => {
      conditionalDepth++;
    };
    const exitConditional = () => {
      conditionalDepth--;
    };

    return {
      CallExpression(node) {
        if (conditionalDepth > 0 && getCallName(node.callee) === "expect") {
          context.report({
            node,
            message:
              "Avoid conditional assertions. Split the behavior into separate tests or assert the complete result. Skill: effect-vitest-tests.",
          });
        }
      },
      IfStatement: enterConditional,
      "IfStatement:exit": exitConditional,
      ConditionalExpression: enterConditional,
      "ConditionalExpression:exit": exitConditional,
      LogicalExpression: enterConditional,
      "LogicalExpression:exit": exitConditional,
      SwitchCase: enterConditional,
      "SwitchCase:exit": exitConditional,
    };
  },
};
