import { getCallName, isIdentifier, typeReferenceName } from "../utils.js";

const schemaSuffix = /(Schema|Model|Struct)$/;

const schemaBaseName = (name) => {
  const base = name.replace(schemaSuffix, "");
  return base !== name && base.length > 0 ? base : undefined;
};

const isSchemaExpression = (node) => {
  if (
    node?.type === "CallExpression" &&
    node.callee?.type === "MemberExpression" &&
    isIdentifier(node.callee.object, "Schema")
  ) {
    return true;
  }
  return (
    node?.type === "CallExpression" &&
    getCallName(node.callee) === "pipe" &&
    isSchemaExpression(node.callee.object)
  );
};

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Require object types to be inferred from nearby Effect Schemas.",
    },
  },
  create(context) {
    const schemaNames = new Set();
    const candidates = [];

    return {
      VariableDeclarator(node) {
        if (!isIdentifier(node.id) || !isSchemaExpression(node.init)) {
          return;
        }
        const baseName = schemaBaseName(node.id.name);
        if (baseName !== undefined) {
          schemaNames.add(baseName);
        }
      },
      TSInterfaceDeclaration(node) {
        candidates.push({ name: node.id?.name, node });
      },
      TSTypeAliasDeclaration(node) {
        if (
          node.typeAnnotation?.type === "TSTypeLiteral" &&
          typeReferenceName(node.typeAnnotation) !== "Schema.Schema.Type"
        ) {
          candidates.push({ name: node.id?.name, node });
        }
      },
      "Program:exit"() {
        for (const candidate of candidates) {
          if (candidate.name !== undefined && schemaNames.has(candidate.name)) {
            context.report({
              node: candidate.node,
              message:
                "Infer this type from its Effect Schema instead of maintaining the object shape twice. Skill: effect-schema-inferred-types.",
            });
          }
        }
      },
    };
  },
};
