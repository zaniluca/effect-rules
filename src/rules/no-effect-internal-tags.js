import { getPropertyName, getStringValue, unwrapExpression } from "../utils.js";

const effectModules = new Set(["Option", "Either", "Result", "Cause", "Exit"]);
const tagsByModule = new Map([
  ["Some", ["Option"]],
  ["None", ["Option"]],
  ["Left", ["Either", "Result"]],
  ["Right", ["Either", "Result"]],
  ["Success", ["Exit", "Result"]],
  ["Failure", ["Exit", "Result"]],
  ["Fail", ["Cause"]],
  ["Die", ["Cause"]],
  ["Interrupt", ["Cause"]],
  ["Sequential", ["Cause"]],
  ["Parallel", ["Cause"]],
  ["Then", ["Cause"]],
  ["Both", ["Cause"]],
  ["Empty", ["Cause"]],
]);

const importedEffectModules = (node) => {
  const moduleName = node.source.value;
  if (typeof moduleName !== "string") {
    return [];
  }
  if (moduleName.startsWith("effect/")) {
    const submodule = moduleName.slice("effect/".length);
    return effectModules.has(submodule) ? [submodule] : [];
  }
  if (moduleName !== "effect") {
    return [];
  }
  return (node.specifiers ?? [])
    .map((specifier) => specifier.imported?.name ?? specifier.imported?.value)
    .filter((name) => effectModules.has(name));
};

const getTagAccess = (node) => {
  const expression = unwrapExpression(node);
  if (expression?.type !== "MemberExpression") {
    return undefined;
  }
  return getPropertyName(expression.property) === "_tag" ? expression : undefined;
};

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow direct tag checks for Effect-owned data types.",
    },
  },
  create(context) {
    const importedModules = new Set();

    return {
      ImportDeclaration(node) {
        for (const moduleName of importedEffectModules(node)) {
          importedModules.add(moduleName);
        }
      },
      BinaryExpression(node) {
        if (!["===", "!==", "==", "!="].includes(node.operator)) {
          return;
        }

        for (const [accessCandidate, tagCandidate] of [
          [node.left, node.right],
          [node.right, node.left],
        ]) {
          const access = getTagAccess(accessCandidate);
          const tag = getStringValue(tagCandidate);
          if (
            access !== undefined &&
            tag !== undefined &&
            (tagsByModule.get(tag)?.some((moduleName) => importedModules.has(moduleName)) ?? false)
          ) {
            context.report({
              node: access,
              message: `Use Effect's public helpers instead of checking the internal tag "${tag}". Skill: effect-typed-errors.`,
            });
          }
        }
      },
    };
  },
};
