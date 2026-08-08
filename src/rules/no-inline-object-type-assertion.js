import { isIdentifier } from "../utils.js";

const isRecordUnknown = (node) =>
  node?.type === "TSTypeReference" &&
  isIdentifier(node.typeName, "Record") &&
  node.typeArguments?.params?.length === 2 &&
  (node.typeArguments.params[0]?.type === "TSStringKeyword" ||
    (node.typeArguments.params[0]?.type === "TSLiteralType" &&
      typeof node.typeArguments.params[0].literal?.value === "string")) &&
  node.typeArguments.params[1]?.type === "TSUnknownKeyword";

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow assertions against inline object-shaped types.",
    },
  },
  create(context) {
    const check = (node) => {
      if (node.typeAnnotation?.type === "TSTypeLiteral" || isRecordUnknown(node.typeAnnotation)) {
        context.report({
          node,
          message:
            "Use a named type, Schema, or a precise type guard instead of an inline object assertion. Skill: effect-schema-boundaries.",
        });
      }
    };

    return {
      TSAsExpression: check,
      TSTypeAssertion: check,
    };
  },
};
