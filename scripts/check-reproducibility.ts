import { createHash } from "node:crypto";
import { readdirSync, readFileSync, rmSync, statSync } from "node:fs";
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

rmSync(".output", { recursive: true, force: true });
build();
const first = publicBuildSnapshot();

rmSync(".output", { recursive: true, force: true });
build();
const second = publicBuildSnapshot();

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
