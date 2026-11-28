import { createHash } from "node:crypto";
import { readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { execFileSync } from "node:child_process";

const BUILD_REPETITIONS = 4;

type ManifestEntry = {
  file?: string;
  src?: string;
  isEntry?: boolean;
  imports?: string[];
  dynamicImports?: string[];
  css?: string[];
  assets?: string[];
};

type ManifestSnapshot = {
  files: string[];
  graph: Map<string, string>;
  summaries: string[];
};

function filesUnder(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  });
}

function publicBuildSnapshot(): Map<string, string> {
  const directory = ".output/public";
  if (!statSync(directory).isDirectory()) {
    throw new Error("Reproducibility check failed: .output/public is missing.");
  }

  const snapshot = new Map<string, string>();
  for (const path of filesUnder(directory).sort()) {
    const relativePath = relative(directory, path).split("\\\\").join("/");
    const digest = createHash("sha256").update(readFileSync(path)).digest("hex");
    snapshot.set(relativePath, digest);
  }
  return snapshot;
}

function manifestSnapshot(): ManifestSnapshot {
  const outputDirectory = ".output";
  const graph = new Map<string, string>();
  const summaries: string[] = [];
  const manifests = filesUnder(outputDirectory)
    .filter((path) => path.endsWith("manifest.json"))
    .sort();

  for (const path of manifests) {
    let parsed: Record<string, ManifestEntry>;
    try {
      parsed = JSON.parse(readFileSync(path, "utf8")) as Record<string, ManifestEntry>;
    } catch {
      continue;
    }

    const keys = Object.keys(parsed).sort();
    let edgeCount = 0;
    for (const key of keys) {
      const entry = parsed[key] ?? {};
      const imports = [...(entry.imports ?? [])].sort();
      const dynamicImports = [...(entry.dynamicImports ?? [])].sort();
      edgeCount += imports.length + dynamicImports.length;
      graph.set(
        `${relative(outputDirectory, path)}::${key}`,
        JSON.stringify({
          file: entry.file ?? null,
          src: entry.src ?? null,
          isEntry: entry.isEntry ?? false,
          imports,
          dynamicImports,
          css: [...(entry.css ?? [])].sort(),
          assets: [...(entry.assets ?? [])].sort(),
        }),
      );
    }
    summaries.push(
      JSON.stringify({
        manifest: relative(outputDirectory, path),
        entries: keys.length,
        staticAndDynamicEdges: edgeCount,
        entryPoints: keys.filter((key) => parsed[key]?.isEntry).length,
      }),
    );
  }

  return { files: manifests.map((path) => relative(outputDirectory, path)), graph, summaries };
}

function fileDigest(path: string): string {
  try {
    return createHash("sha256").update(readFileSync(path)).digest("hex");
  } catch {
    return "<missing>";
  }
}

function snapshotDigest(snapshot: Map<string, string>): string {
  const hash = createHash("sha256");
  for (const [path, digest] of [...snapshot.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    hash.update(path);
    hash.update("\\0");
    hash.update(digest);
    hash.update("\\0");
  }
  return hash.digest("hex");
}

function cleanBuildArtifacts(): void {
  // Each independent build must start without generated framework or bundler state.
  rmSync(".output", { recursive: true, force: true });
  rmSync(".tanstack", { recursive: true, force: true });
  rmSync(".vinxi", { recursive: true, force: true });
  rmSync(".nitro", { recursive: true, force: true });
  rmSync("node_modules/.vite", { recursive: true, force: true });
  rmSync("node_modules/.nitro", { recursive: true, force: true });
}

function build(): void {
  execFileSync("bun", ["run", "build:check"], { stdio: "inherit" });
}

const routeTreePath = "src/routeTree.gen.ts";
const routeTreeBefore = fileDigest(routeTreePath);
const snapshots: Map<string, string>[] = [];
const digests: string[] = [];
const routeTreeAfter: string[] = [];
const manifests: ManifestSnapshot[] = [];

for (let repetition = 1; repetition <= BUILD_REPETITIONS; repetition += 1) {
  cleanBuildArtifacts();
  console.log(
    `[reproducibility] build ${repetition}/${BUILD_REPETITIONS} starts from clean generated state`,
  );
  build();

  const snapshot = publicBuildSnapshot();
  const digest = snapshotDigest(snapshot);
  const manifest = manifestSnapshot();
  snapshots.push(snapshot);
  digests.push(digest);
  manifests.push(manifest);
  routeTreeAfter.push(fileDigest(routeTreePath));
  console.log(
    JSON.stringify({
      repetition,
      publicBuildSha256: digest,
      routeTreeSha256: routeTreeAfter[repetition - 1],
      manifestFiles: manifest.files,
      manifests: manifest.summaries,
      moduleGraphNodes: manifest.graph.size,
    }),
  );
}

const baseline = snapshots[0];
const baselineDigest = digests[0];
const mismatches: string[] = [];

for (let index = 1; index < snapshots.length; index += 1) {
  const current = snapshots[index];
  const paths = [...new Set([...baseline.keys(), ...current.keys()])].sort();
  const changed = paths.filter((path) => baseline.get(path) !== current.get(path));

  if (digests[index] !== baselineDigest) {
    mismatches.push(
      `build 1 vs build ${index + 1}: ${changed.length} changed files (sha256 ${baselineDigest} vs ${digests[index]})`,
    );
    for (const path of changed) {
      mismatches.push(
        `- ${path}: build 1=${baseline.get(path) ?? "<missing>"}, build ${index + 1}=${current.get(path) ?? "<missing>"}`,
      );
    }

    const firstGraph = manifests[0].graph;
    const currentGraph = manifests[index].graph;
    const graphKeys = [...new Set([...firstGraph.keys(), ...currentGraph.keys()])].sort();
    const graphChanges = graphKeys.filter((key) => firstGraph.get(key) !== currentGraph.get(key));
    mismatches.push(
      `module graph build 1 vs build ${index + 1}: ${graphChanges.length} changed manifest entries`,
    );
    for (const key of graphChanges.slice(0, 100)) {
      mismatches.push(
        `- graph ${key}: build 1=${firstGraph.get(key) ?? "<missing>"}, build ${index + 1}=${currentGraph.get(key) ?? "<missing>"}`,
      );
    }
    if (graphChanges.length > 100) {
      mismatches.push(`- ${graphChanges.length - 100} additional graph changes omitted`);
    }
    mismatches.push(
      `manifest paths build 1=${JSON.stringify(manifests[0].files)}, build ${index + 1}=${JSON.stringify(manifests[index].files)}`,
    );
  }
}

if (mismatches.length > 0) {
  throw new Error(
    [
      "Reproducibility check failed: clean public build outputs differ.",
      `routeTree.gen.ts: before=${routeTreeBefore}, afterBuilds=${routeTreeAfter.join(",")}`,
      ...mismatches,
    ].join("\\n"),
  );
}

console.log(
  JSON.stringify({
    status: "ok",
    repetitions: BUILD_REPETITIONS,
    publicBuildSha256: baselineDigest,
    routeTreeStable: routeTreeAfter.every((digest) => digest === routeTreeBefore),
    moduleGraphStable: manifests.every(
      (manifest) =>
        JSON.stringify([...manifest.graph.entries()].sort()) ===
        JSON.stringify([...manifests[0].graph.entries()].sort()),
    ),
  }),
);
