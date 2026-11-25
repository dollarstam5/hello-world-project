import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const requiredFiles = [
  "README.md",
  "ARCHITECTURE.md",
  "PRODUCTION_CHECKLIST.md",
  "package.json",
  "src/routes/__root.tsx",
  "src/app/index.ts",
  "src/app/bootstrap/index.ts",
  "src/app/bootstrap/useRootLifecycle.ts",
  "src/app/composition/RootAppComposition.tsx",
  "src/app/shell/AppShell.tsx",
  "src/config/index.ts",
  "src/config/env.public.ts",
  "src/config/env.server.ts",
  "src/platform/index.ts",
  "src/platform/pwa.ts",
  "src/platform/offline/index.ts",
  "src/platform/notifications/index.ts",
  "src/platform/performance/index.ts",
  "src/shared/index.ts",
  "src/shared/ui/index.ts",
  "src/shared/constants/index.ts",
  "src/shared/types/index.ts",
  "src/data/knowledge.json",
  "src/data/vita-dictionary.json",
  "tooling/README.md",
  "tooling/scripts/check-foundation.mjs",
  "tests/vitest.config.ts",
];

const missing = [];
for (const file of requiredFiles) {
  try {
    await access(resolve(file));
  } catch {
    missing.push(file);
  }
}

let knowledgeError;
try {
  const knowledge = JSON.parse(await readFile(resolve("src/data/knowledge.json"), "utf8"));
  const entries = knowledge?.entries;
  if (!Array.isArray(entries) || entries.length < 50) {
    knowledgeError = "knowledge.json must contain at least 50 entries.";
  } else {
    const invalid = entries.findIndex(
      (entry) =>
        !entry ||
        typeof entry.id !== "string" ||
        typeof entry.locale !== "string" ||
        typeof entry.answer !== "string" ||
        !Array.isArray(entry.questions) ||
        !Array.isArray(entry.keywords),
    );
    if (invalid !== -1) {
      knowledgeError = `knowledge.json entry ${invalid + 1} has an invalid structure.`;
    }
  }
} catch {
  knowledgeError = "knowledge.json must be valid JSON.";
}

if (missing.length || knowledgeError) {
  if (missing.length) console.error(`Missing foundation anchors:\n${missing.join("\n")}`);
  if (knowledgeError) console.error(knowledgeError);
  process.exitCode = 1;
} else {
  console.log(
    `Foundation check passed: ${requiredFiles.length} architecture anchors and local knowledge (${50}+ entries) are present.`,
  );
}
