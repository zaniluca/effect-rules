export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow try/catch and throw in Effect domain code.",
    },
  },
  create(context) {
    return {
      TryStatement(node) {
        context.report({
          node,
          message:
            "Model failures with Effect.try, Effect.tryPromise, or typed errors. Keep try/catch inside explicit adapter boundaries. Skill: effect-typed-errors.",
        });
      },
      ThrowStatement(node) {
        context.report({
          node,
          message:
            "Yield or fail with a typed Effect error. Keep throws inside explicit adapter boundaries. Skill: effect-typed-errors.",
        });
      },
    };
  },
};
