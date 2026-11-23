import { existsSync, readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));

const requiredFiles = [
  "docs/README.md",
  "docs/foundation/README.md",
  "docs/engineering/ai/README.md",
  "docs/operations/README.md",
  "docs/operations/QUALITY.md",
  "docs/operations/operations.md",
  "docs/operations/performance-pwa.md",
  "docs/operations/release-readiness.md",
  "docs/operations/REPRODUCIBILITY.md",
  "docs/reference/documentation-content-coverage.md",
  "src/lib/performance/performance-budget-policy.ts",
  "src/lib/performance/web-vitals.ts",
  "src/platform/pwa.ts",
  "tooling/scripts/check-performance-budgets.ts",
  "tooling/scripts/check-global-audit.ts",
  "tooling/scripts/check-reproducibility.ts",
  "tooling/scripts/test-mobile-e2e.sh",
];

const requiredScripts = [
  "check:release",
  "check:performance-budget",
  "check:global-audit",
  "check:reproducibility",
  "check:mobile-e2e",
  "test:e2e",
];

const missingFiles = requiredFiles.filter((path) => !existsSync(path));
const missingScripts = requiredScripts.filter((name) => !packageJson.scripts?.[name]);

if (missingFiles.length > 0 || missingScripts.length > 0) {
  throw new Error(
    `Go/No-Go check failed: ${[
      ...missingFiles.map((path) => `missing file: ${path}`),
      ...missingScripts.map((name) => `missing script: ${name}`),
    ].join("; ")}`,
  );
}

if (existsSync(".env")) {
  throw new Error("Go/No-Go check failed: .env must not exist in CI.");
}

console.log(
  JSON.stringify({
    decision: "GO_CANDIDATE",
    requiredFiles: requiredFiles.length,
    requiredScripts: requiredScripts.length,
    authentication: "out-of-scope",
    externalReleaseApprovalRequired: true,
  }),
);
