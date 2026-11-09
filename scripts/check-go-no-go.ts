import { existsSync, readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));

const requiredFiles = [
  "docs/README.md",
  "docs/00-foundation/README.md",
  "docs/05-ai/README.md",
  "docs/06-operations/README.md",
  "docs/06-operations/QUALITY.md",
  "docs/06-operations/operations.md",
  "docs/06-operations/performance-pwa.md",
  "docs/06-operations/release-readiness.md",
  "docs/06-operations/REPRODUCIBILITY.md",
  "docs/07-annexes/documentation-content-coverage.md",
  "src/lib/performance/performance-budget-policy.ts",
  "src/lib/performance/web-vitals.ts",
  "src/platform/pwa.ts",
  "scripts/check-performance-budgets.ts",
  "scripts/check-global-audit.ts",
  "scripts/check-reproducibility.ts",
  "scripts/test-mobile-e2e.sh",
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
