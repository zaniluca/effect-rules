export const normalizePath = (filename) => filename.replaceAll("\\", "/");

export const isConfigOrTooling = (filename) => {
  const normalized = normalizePath(filename);
  return (
    /(^|\/)(vite|vitest|tsup|drizzle|oxlint)\.config\.[cm]?[jt]s$/.test(normalized) ||
    /(^|\/)(scripts|tooling)\//.test(normalized)
  );
};

export const isTestLike = (filename) => {
  const normalized = normalizePath(filename);
  return (
    /(\.|\/)(test|spec|e2e|node\.test)\.[cm]?[jt]sx?$/.test(normalized) ||
    /(^|\/)(test|tests)\//.test(normalized)
  );
};

export const isDeclarationFile = (filename) => normalizePath(filename).endsWith(".d.ts");

export const unwrapExpression = (node) => {
  let current = node;
  while (
    current?.type === "ChainExpression" ||
    current?.type === "ParenthesizedExpression" ||
    current?.type === "TSNonNullExpression" ||
    current?.type === "TSAsExpression" ||
    current?.type === "TSTypeAssertion"
  ) {
    current = current.expression;
  }
  return current;
};

export const getPropertyName = (node) => {
  if (node?.type === "Identifier" || node?.type === "PrivateIdentifier") {
    return node.name;
  }
  if (
    (node?.type === "Literal" || node?.type === "StringLiteral") &&
    typeof node.value === "string"
  ) {
    return node.value;
  }
  return undefined;
};

export const getCallName = (node) => {
  const expression = unwrapExpression(node);
  if (expression?.type === "Identifier") {
    return expression.name;
  }
  if (expression?.type === "MemberExpression") {
    return getPropertyName(expression.property);
  }
  return undefined;
};

export const getStringValue = (node) => {
  const expression = unwrapExpression(node);
  if (
    (expression?.type === "Literal" || expression?.type === "StringLiteral") &&
    typeof expression.value === "string"
  ) {
    return expression.value;
  }
  return undefined;
};

export const isIdentifier = (node, name) =>
  node?.type === "Identifier" && (name === undefined || node.name === name);

export const isStringLiteral = (node) =>
  (node?.type === "Literal" && typeof node.value === "string") || node?.type === "StringLiteral";

export const nodeName = (node) => {
  if (isIdentifier(node) || node?.type === "PrivateIdentifier") {
    return node.name;
  }
  if (isStringLiteral(node)) {
    return node.value;
  }
  return undefined;
};

const typeName = (node) => {
  if (node?.type === "Identifier") {
    return node.name;
  }
  if (node?.type === "TSQualifiedName") {
    const left = typeName(node.left);
    const right = typeName(node.right);
    return left !== undefined && right !== undefined ? `${left}.${right}` : undefined;
  }
  return undefined;
};

export const typeReferenceName = (node) =>
  node?.type === "TSTypeReference" ? typeName(node.typeName) : undefined;

export const containsPromiseType = (node) => {
  if (node === undefined || node === null || typeof node !== "object") {
    return false;
  }
  if (typeReferenceName(node) === "Promise") {
    return true;
  }

  switch (node.type) {
    case "TSTypeAnnotation":
    case "TSParenthesizedType":
      return containsPromiseType(node.typeAnnotation);
    case "TSFunctionType":
      return containsPromiseType(node.returnType);
    case "TSUnionType":
    case "TSIntersectionType":
      return (node.types ?? []).some(containsPromiseType);
    case "TSConditionalType":
      return containsPromiseType(node.trueType) || containsPromiseType(node.falseType);
    default:
      return false;
  }
};
