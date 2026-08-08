import { spawnSync } from "node:child_process";

const environment = { ...process.env };

for (const key of Object.keys(environment)) {
  if (/^(?:npm|pnpm)_config_.*(?:build_scripts|globalconfig|jsr|verify)/i.test(key)) {
    delete environment[key];
  }
}

const result = spawnSync("npm", ["pack", "--dry-run"], {
  env: environment,
  stdio: "inherit",
});

if (result.error) {
  throw result.error;
}

process.exitCode = result.status ?? 1;
