import { createHash } from "node:crypto";
import { readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { execFileSync } from "node:child_process";

const BUILD_REPETITIONS = 4;

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
    const relativePath = relative(directory, path).split("\\").join("/");
    const digest = createHash("sha256").update(readFileSync(path)).digest("hex");
    snapshot.set(relativePath, digest);
  }
  return snapshot;
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
    hash.update("\0");
    hash.update(digest);
    hash.update("\0");
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
}

function build(): void {
  execFileSync("bun", ["run", "build:check"], { stdio: "inherit" });
}

const routeTreePath = "src/routeTree.gen.ts";
const routeTreeBefore = fileDigest(routeTreePath);
const snapshots: Map<string, string>[] = [];
const digests: string[] = [];
const routeTreeAfter: string[] = [];

for (let repetition = 1; repetition <= BUILD_REPETITIONS; repetition += 1) {
  cleanBuildArtifacts();
  console.log(
    `[reproducibility] build ${repetition}/${BUILD_REPETITIONS} starts from clean generated state`,
  );
  build();

  const snapshot = publicBuildSnapshot();
  const digest = snapshotDigest(snapshot);
  snapshots.push(snapshot);
  digests.push(digest);
  routeTreeAfter.push(fileDigest(routeTreePath));
  console.log(
    JSON.stringify({
      repetition,
      publicBuildSha256: digest,
      routeTreeSha256: routeTreeAfter[repetition - 1],
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
  }
}

if (mismatches.length > 0) {
  throw new Error(
    [
      "Reproducibility check failed: clean public build outputs differ.",
      `routeTree.gen.ts: before=${routeTreeBefore}, afterBuilds=${routeTreeAfter.join(",")}`,
      ...mismatches,
    ].join("\n"),
  );
}

console.log(
  JSON.stringify({
    status: "ok",
    repetitions: BUILD_REPETITIONS,
    publicBuildSha256: baselineDigest,
    routeTreeStable: routeTreeAfter.every((digest) => digest === routeTreeBefore),
  }),
);
