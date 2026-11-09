import { existsSync, readFileSync } from "node:fs";

const requiredFiles = [
  "docs/README.md",
  "docs/00-foundation/README.md",
  "docs/01-product/README.md",
  "docs/02-architecture/README.md",
  "docs/03-engines/README.md",
  "docs/05-ai/README.md",
  "docs/06-operations/README.md",
  "docs/06-operations/QUALITY.md",
  "docs/06-operations/operations.md",
  "docs/06-operations/performance-pwa.md",
  "docs/07-annexes/documentation-content-coverage.md",
  "tests/mobile-e2e-contract.test.ts",
  "tests/platform/use-network-status.test.tsx",
  "src/lib/performance/performance-policy.ts",
  "src/lib/performance/performance-budget-policy.ts",
  "src/lib/performance/web-vitals.ts",
  "src/platform/pwa.ts",
  "scripts/check-performance-budgets.ts",
  "scripts/test-mobile-e2e.sh",
];

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
const requiredScripts = [
  "check:pwa",
  "check:web-vitals",
  "check:performance-budget",
  "check:mobile-e2e",
  "test:e2e",
];

const missingFiles = requiredFiles.filter((path) => !existsSync(path));
const missingScripts = requiredScripts.filter((name) => !packageJson.scripts?.[name]);

if (missingFiles.length > 0 || missingScripts.length > 0) {
  const details = [
    ...missingFiles.map((path) => `missing file: ${path}`),
    ...missingScripts.map((name) => `missing script: ${name}`),
  ];
  throw new Error(`Global audit failed: ${details.join("; ")}`);
}

if (existsSync(".env")) {
  throw new Error("Global audit failed: tracked/local .env must not exist in CI.");
}

console.log(
  JSON.stringify({
    status: "ok",
    requiredFiles: requiredFiles.length,
    requiredScripts: requiredScripts.length,
    authentication: "out-of-scope",
  }),
);
