import { gzipSync } from "node:zlib";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  assertPerformanceBudgets,
  type PerformanceBudgetResult,
} from "../src/lib/performance/performance-budget-policy";

function filesUnder(directory: string): string[] {
  const entries = readdirSync(directory, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return filesUnder(path);
    return path;
  });
}

function gzipKb(path: string): number {
  return gzipSync(readFileSync(path), { level: 9 }).length / 1024;
}

function measurePerformanceBudgets(clientDirectory: string): PerformanceBudgetResult {
  if (!statSync(clientDirectory).isDirectory()) {
    throw new Error(`Client build directory does not exist: ${clientDirectory}`);
  }

  const assets = filesUnder(clientDirectory);
  const htmlFiles = assets.filter((path) => path.endsWith(".html"));
  const referenced = new Set<string>();

  for (const htmlPath of htmlFiles) {
    const html = readFileSync(htmlPath, "utf8");
    for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
      const reference = match[1];
      if (!reference || reference.startsWith("http") || reference.startsWith("//")) {
        continue;
      }
      const relative = reference.replace(/^\//, "").split("?")[0].split("#")[0];
      const candidate = join(clientDirectory, relative);
      if (assets.includes(candidate)) {
        referenced.add(candidate);
      }
    }
  }

  const initial =
    referenced.size > 0
      ? [...referenced]
      : assets.filter((path) => path.endsWith(".js") || path.endsWith(".css"));
  const javascript = initial.filter((path) => path.endsWith(".js"));
  const css = initial.filter((path) => path.endsWith(".css"));
  const critical = initial.filter((path) => /\.(?:js|css|woff2?|ttf|webp|png|svg)$/i.test(path));

  return {
    initialJavaScriptGzipKb: javascript.reduce((sum, path) => sum + gzipKb(path), 0),
    initialCssGzipKb: css.reduce((sum, path) => sum + gzipKb(path), 0),
    criticalResourcesGzipKb: critical.reduce((sum, path) => sum + gzipKb(path), 0),
  };
}

const candidates = ["dist/client", "dist", ".output/public"];
const clientDirectory = candidates.find((path) => {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
});

if (!clientDirectory) {
  throw new Error(`No client build output found. Expected one of: ${candidates.join(", ")}`);
}

const result = measurePerformanceBudgets(clientDirectory);
console.log(
  JSON.stringify({
    directory: join(process.cwd(), clientDirectory),
    ...result,
  }),
);
assertPerformanceBudgets(result);
