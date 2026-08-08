export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Prefer Effect Match over JavaScript switch statements.",
    },
  },
  create(context) {
    return {
      SwitchStatement(node) {
        context.report({
          node,
          message:
            "Use Effect Match and finish with Match.exhaustive so new union members fail at compile time. Skill: effect-match.",
        });
      },
    };
  },
};
