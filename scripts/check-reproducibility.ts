import { createHash } from "node:crypto";
import { readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { execFileSync } from "node:child_process";

type BuildSnapshot = {
  digest: string;
  files: Map<string, string>;
};

function filesUnder(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  });
}

function publicBuildSnapshot(): BuildSnapshot {
  const directory = ".output/public";
  if (!statSync(directory).isDirectory()) {
    throw new Error("Reproducibility check failed: .output/public is missing.");
  }

  const files = new Map<string, string>();
  const hash = createHash("sha256");
  for (const path of filesUnder(directory).sort()) {
    const name = relative(directory, path).split("\\").join("/");
    const fileHash = createHash("sha256").update(readFileSync(path)).digest("hex");
    files.set(name, fileHash);
    hash.update(name);
    hash.update("\0");
    hash.update(fileHash);
    hash.update("\0");
  }
  return { digest: hash.digest("hex"), files };
}

function build(): void {
  execFileSync("bun", ["run", "build:check"], { stdio: "inherit" });
}

const generatedRouteTree = "src/routeTree.gen.ts";
const originalRouteTree = readFileSync(generatedRouteTree);

function resetBuildArtifacts(): void {
  // Each snapshot must start from the same cold build state. The release check
  // has already built once, so clearing only .output leaves warm Vite/Nitro and
  // TanStack artifacts that can change chunk graphs between the two builds.
  for (const directory of [".output", ".tanstack", ".vinxi", ".nitro", "node_modules/.nitro"]) {
    rmSync(directory, { recursive: true, force: true });
  }

  // TanStack Router may rewrite its generated route tree during a build.
  // Restore the checked-in input so both builds start from identical sources.
  writeFileSync(generatedRouteTree, originalRouteTree);
}

let first: BuildSnapshot;
let second: BuildSnapshot;

try {
  resetBuildArtifacts();
  build();
  first = publicBuildSnapshot();

  resetBuildArtifacts();
  build();
  second = publicBuildSnapshot();
} finally {
  // Do not leave generated source changes behind if a build or comparison fails.
  writeFileSync(generatedRouteTree, originalRouteTree);
}

if (first.digest !== second.digest) {
  const paths = [...new Set([...first.files.keys(), ...second.files.keys()])].sort();
  const changedFiles = paths.filter((path) => first.files.get(path) !== second.files.get(path));
  throw new Error(
    [
      "Reproducibility check failed: public build digests differ",
      `(first=${first.digest}, second=${second.digest}).`,
      `Changed public files (${changedFiles.length}):`,
      ...changedFiles.map(
        (path) =>
          `- ${path}: ${first.files.get(path) ?? "missing"} -> ${second.files.get(path) ?? "missing"}`,
      ),
    ].join("\n"),
  );
}

console.log(JSON.stringify({ status: "ok", publicBuildSha256: first.digest }));
