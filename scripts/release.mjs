import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const argumentsSet = new Set(process.argv.slice(2));
const stableVersionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

const write = (message) => process.stdout.write(`${message}\n`);

const run = (command, args, { capture = false } = {}) => {
  const result = spawnSync(command, args, {
    cwd: repositoryRoot,
    encoding: "utf8",
    stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    const details = capture ? `\n${result.stdout}${result.stderr}`.trimEnd() : "";
    throw new Error(`${command} ${args.join(" ")} failed${details}`);
  }

  return result;
};

const outputOf = (command, args) => run(command, args, { capture: true }).stdout.trim();

const assertVersionIsUnpublished = async (packageName, version) => {
  const response = await fetch(
    `https://registry.npmjs.org/${encodeURIComponent(packageName)}/${encodeURIComponent(version)}`,
  );

  if (response.status === 404) {
    return;
  }
  if (response.ok) {
    throw new Error(`${packageName}@${version} is already published on npm`);
  }

  throw new Error(`npm registry returned HTTP ${response.status} while checking the version`);
};

const main = async () => {
  for (const argument of argumentsSet) {
    if (argument !== "--dry-run" && argument !== "--help") {
      throw new Error(`unsupported argument: ${argument}`);
    }
  }

  if (argumentsSet.has("--help")) {
    write("Usage: pnpm run release [--dry-run]");
    return;
  }

  const packageJson = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );
  if (!stableVersionPattern.test(packageJson.version)) {
    throw new Error(`package version must use the stable X.Y.Z format: ${packageJson.version}`);
  }

  const tag = `v${packageJson.version}`;

  run("gh", ["auth", "status"]);

  if (outputOf("git", ["status", "--porcelain"])) {
    throw new Error("the Git worktree is not clean; commit or stash changes before releasing");
  }

  const branch = outputOf("git", ["branch", "--show-current"]);
  if (!branch) {
    throw new Error("releases cannot be created from a detached HEAD");
  }

  const upstream = outputOf("git", [
    "rev-parse",
    "--abbrev-ref",
    "--symbolic-full-name",
    "@{upstream}",
  ]);
  if (!upstream.startsWith("origin/")) {
    throw new Error(`the current branch must track origin: ${upstream}`);
  }

  run("git", ["fetch", "origin"]);

  const headCommit = outputOf("git", ["rev-parse", "HEAD"]);
  if (headCommit !== outputOf("git", ["rev-parse", "@{upstream}"])) {
    throw new Error(`${branch} is not synchronized with ${upstream}`);
  }

  if (outputOf("git", ["ls-remote", "--tags", "origin", `refs/tags/${tag}`])) {
    throw new Error(`${tag} already exists on origin`);
  }

  await assertVersionIsUnpublished(packageJson.name, packageJson.version);

  write(`Running release checks for ${packageJson.name}@${packageJson.version}...`);
  run("pnpm", ["check"]);

  write(`\nRelease: ${tag}`);
  write(`Commit:  ${headCommit}`);
  write("GitHub:  tag and Release will be created, triggering the npm workflow");

  if (argumentsSet.has("--dry-run")) {
    write("\nDry run complete. Nothing was created.");
    return;
  }

  if (!process.stdin.isTTY) {
    throw new Error("release confirmation requires an interactive terminal");
  }

  const prompt = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await prompt.question(`Type ${tag} to publish the release: `);
  prompt.close();
  if (answer !== tag) {
    throw new Error("release confirmation did not match the expected tag");
  }

  run("gh", ["release", "create", tag, "--target", headCommit, "--title", tag, "--generate-notes"]);

  write(`Release ${tag} published. Monitor it with:`);
  write("gh run list --workflow publish.yml --limit 1");
};

main().catch((error) => {
  process.stderr.write(`Release aborted: ${error.message}\n`);
  process.exitCode = 1;
});
