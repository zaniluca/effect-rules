import { containsPromiseType, nodeName } from "../utils.js";

const isClientInterface = (node) => {
  const name = nodeName(node.id);
  return (
    typeof name === "string" &&
    (name.endsWith("Client") ||
      (node.parent?.type === "ExportNamedDeclaration" && name.endsWith("Sdk")))
  );
};

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow Promise-returning methods on Effect client interfaces.",
    },
  },
  create(context) {
    return {
      TSInterfaceDeclaration(node) {
        if (!isClientInterface(node)) {
          return;
        }
        for (const member of node.body?.body ?? []) {
          const returnsPromise =
            (member.type === "TSMethodSignature" && containsPromiseType(member.returnType)) ||
            (member.type === "TSPropertySignature" && containsPromiseType(member.typeAnnotation));
          if (returnsPromise) {
            context.report({
              node: member,
              message:
                "Wrap third-party Promises at the adapter boundary and expose Effect-returning client methods. Skill: effect-client-boundaries.",
            });
          }
        }
      },
    };
  },
};
