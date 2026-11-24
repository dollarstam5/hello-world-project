import { readdir, stat } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";

const root = process.cwd();
const sourceRoots = ["src", "packages", "tests", "tooling"];
const sourceExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
const resolutionExtensions = [
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json", ".css", ".scss",
  ".svg", ".png", ".jpg", ".jpeg", ".webp", ".woff", ".woff2",
];
const workspaceAliases = {
  "@eco/core-contracts": "packages/core-contracts/src/index.ts",
  "@eco/core-logic": "packages/core-logic/src/index.ts",
  "@eco/core-db": "packages/core-db/src/index.ts",
  "@eco/core-sync": "packages/core-sync/src/index.ts",
};
const legacyOwners = [
  /^@\/domains\//,
  /^@\/components\/app\/(?:Surface|Icon|Indicator|FormField|StatusBanner|Skeletons|BottomNav|MenuSheet)(?:\/|$)/,
  /^@\/components\/experience\/(?:OfflineBanner|InstallBanner|UpdateBanner|HomeFoundation|AccountInformationPage|ProfileManagementPage|ProfileVisibilitySettingsPage|PublicProfilePreviewPage|ApplicationSettingsPage|VitalisVisionPage|VisionEngineArtwork|VitalisVisionCard|SectionFoundation|SmartStateView)(?:\/|$)/,
];

async function walk(directory) {
  const absolute = resolve(root, directory);
  let entries;
  try {
    entries = await readdir(absolute, { withFileTypes: true });
  } catch {
    return [];
  }

  const files = [];
  for (const entry of entries) {
    const path = join(absolute, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", ".git", "dist", "build"].includes(entry.name)) continue;
      files.push(...(await walk(path)));
    } else if (entry.isFile() && sourceExtensions.has(extname(entry.name))) {
      files.push(path);
    }
  }
  return files;
}

function extractSpecifiers(source) {
  const specifiers = [];
  const staticImport = /\b(?:import|export)\s+(?:type\s+)?(?:[^'";]*?\s+from\s*)?["']([^"']+)["']/gs;
  const dynamicImport = /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g;
  for (const match of source.matchAll(staticImport)) specifiers.push(match[1]);
  for (const match of source.matchAll(dynamicImport)) specifiers.push(match[1]);
  return [...new Set(specifiers)];
}

function localBase(specifier, importer) {
  const clean = specifier.split(/[?#]/, 1)[0];
  if (clean.startsWith("@/")) return resolve(root, "src", clean.slice(2));
  if (clean.startsWith(".")) return resolve(dirname(importer), clean);
  const alias = Object.keys(workspaceAliases).find(
    (key) => clean === key || clean.startsWith(key + "/"),
  );
  if (alias) {
    const target = resolve(root, workspaceAliases[alias]);
    return clean === alias ? target : resolve(dirname(target), clean.slice(alias.length + 1));
  }
  return null;
}

async function resolves(base) {
  const candidates = [base];
  if (!extname(base)) {
    for (const extension of resolutionExtensions) candidates.push(base + extension);
    for (const extension of resolutionExtensions) candidates.push(join(base, "index" + extension));
  }
  for (const candidate of candidates) {
    try {
      if ((await stat(candidate)).isFile()) return true;
    } catch {
      // Try the next TypeScript/bundler resolution candidate.
    }
  }
  return false;
}

const files = (await Promise.all(sourceRoots.map(walk))).flat();
const unresolved = [];
const legacy = [];
let localImportCount = 0;

for (const file of files) {
  const source = await (await import("node:fs/promises")).readFile(file, "utf8");
  for (const specifier of extractSpecifiers(source)) {
    const base = localBase(specifier, file);
    if (!base) continue;
    localImportCount += 1;
    if (legacyOwners.some((pattern) => pattern.test(specifier))) {
      legacy.push({ file: file.slice(root.length + 1), specifier });
    }
    if (!(await resolves(base))) {
      unresolved.push({ file: file.slice(root.length + 1), specifier });
    }
  }
}

if (unresolved.length) {
  console.error("Unresolved local imports:");
  for (const item of unresolved) console.error(`- ${item.file} -> ${item.specifier}`);
  process.exitCode = 1;
} else {
  console.log(`Import resolution passed: ${files.length} source files and ${localImportCount} local imports checked.`);
}

if (legacy.length) {
  console.warn(`Legacy ownership paths still referenced: ${legacy.length}`);
  for (const item of legacy) console.warn(`- ${item.file} -> ${item.specifier}`);
} else {
  console.log("No legacy ownership imports detected for migrated paths.");
}
