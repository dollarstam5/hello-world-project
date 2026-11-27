import { createHash } from "node:crypto";
import { readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { execFileSync } from "node:child_process";

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
  // A previous Vite run can leave optimizer metadata behind even after .output
  // is removed. Each reproducibility pass must start without that cache.
  rmSync(".output", { recursive: true, force: true });
  rmSync("node_modules/.vite", { recursive: true, force: true });
}

function build(): void {
  execFileSync("bun", ["run", "build:check"], { stdio: "inherit" });
}

const routeTreePath = "src/routeTree.gen.ts";
const routeTreeBefore = fileDigest(routeTreePath);

cleanBuildArtifacts();
console.log("[reproducibility] first build starts with clean Vite cache");
build();
const first = publicBuildSnapshot();
const routeTreeAfterFirst = fileDigest(routeTreePath);

cleanBuildArtifacts();
console.log("[reproducibility] second build starts with clean Vite cache");
build();
const second = publicBuildSnapshot();
const routeTreeAfterSecond = fileDigest(routeTreePath);

const firstDigest = snapshotDigest(first);
const secondDigest = snapshotDigest(second);

if (firstDigest !== secondDigest) {
  const paths = [...new Set([...first.keys(), ...second.keys()])].sort();
  const changed = paths.filter((path) => first.get(path) !== second.get(path));
  throw new Error(
    [
      "Reproducibility check failed: public build outputs differ.",
      `first=${firstDigest}`,
      `second=${secondDigest}`,
      `routeTree.gen.ts: before=${routeTreeBefore}, afterFirst=${routeTreeAfterFirst}, afterSecond=${routeTreeAfterSecond}`,
      `changed files (${changed.length}):`,
      ...changed.map((path) => {
        const before = first.get(path) ?? "<missing>";
        const after = second.get(path) ?? "<missing>";
        return `- ${path}: first=${before}, second=${after}`;
      }),
    ].join("\\n"),
  );
}

console.log(JSON.stringify({ status: "ok", publicBuildSha256: firstDigest }));
