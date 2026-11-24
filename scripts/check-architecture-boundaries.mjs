import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";

const sourceExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);
const appLayers = ["shared", "platform", "features", "domains", "widgets", "routes"];
const packageLayers = ["core-contracts", "core-logic", "core-db", "core-sync"];
const violations = [];

function collectFiles(directory) {
  if (!statSync(directory, { throwIfNoEntry: false })?.isDirectory()) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return collectFiles(path);
    return sourceExtensions.has(extname(entry.name)) ? [path] : [];
  });
}

function layerFor(file, root, layers) {
  const relative = file.slice(root.length + 1).split(/[\\/]/);
  return layers.indexOf(relative[0]);
}

function importSpecifiers(source) {
  const found = new Set();
  const patterns = [
    /\b(?:import|export)\s+(?:type\s+)?(?:[\w*{},\s]+\s+from\s*)?["']([^"']+)["']/g,
    /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g,
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) found.add(match[1]);
  }
  return found;
}

function resolveAppImport(specifier, fromFile) {
  if (specifier.startsWith("@/")) return resolve("src", specifier.slice(2));
  if (specifier.startsWith(".")) return resolve(dirname(fromFile), specifier);
  return null;
}

function resolvePackageImport(specifier) {
  const match = specifier.match(/^@eco\/(core-[a-z-]+)/);
  if (!match) return null;
  const index = packageLayers.indexOf(match[1]);
  return index === -1 ? null : index;
}

const srcRoot = resolve("src");
for (const sourceFile of appLayers.flatMap((layer) => collectFiles(resolve(srcRoot, layer)))) {
  const sourceLayer = layerFor(sourceFile, srcRoot, appLayers);
  const source = readFileSync(sourceFile, "utf8");
  for (const specifier of importSpecifiers(source)) {
    const target = resolveAppImport(specifier, sourceFile);
    if (!target || !target.startsWith(srcRoot + "/")) continue;
    const targetLayer = layerFor(target, srcRoot, appLayers);
    if (targetLayer > sourceLayer) {
      violations.push(
        `${sourceFile}: ${appLayers[sourceLayer]} must not import ${specifier} (${appLayers[targetLayer]})`,
      );
    }
  }
}

const packagesRoot = resolve("packages");
for (const packageName of packageLayers) {
  const packageRoot = resolve(packagesRoot, packageName);
  for (const sourceFile of collectFiles(resolve(packageRoot, "src"))) {
    const sourceLayer = packageLayers.indexOf(packageName);
    const source = readFileSync(sourceFile, "utf8");
    for (const specifier of importSpecifiers(source)) {
      const targetLayer = resolvePackageImport(specifier);
      if (targetLayer !== null && targetLayer > sourceLayer) {
        violations.push(
          `${sourceFile}: ${packageName} must not import ${specifier} (${packageLayers[targetLayer]})`,
        );
      }
    }
  }
}

if (violations.length > 0) {
  console.error("Architecture boundary violations:");
  for (const violation of violations) console.error(`- ${violation}`);
  process.exitCode = 1;
} else {
  console.log(
    `Architecture boundaries OK: ${appLayers.length} application layers and ${packageLayers.length} core packages checked.`,
  );
}
