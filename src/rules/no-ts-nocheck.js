export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow @ts-nocheck directives.",
    },
  },
  create(context) {
    return {
      Program(node) {
        if (/@ts-nocheck\b/.test(context.sourceCode.text)) {
          context.report({
            node,
            message:
              "Remove @ts-nocheck and fix or isolate the typed boundary. Skill: effect-schema-boundaries.",
          });
        }
      },
    };
  },
};
