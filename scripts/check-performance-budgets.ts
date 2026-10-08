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

function resolveReference(
  clientDirectory: string,
  assets: string[],
  reference: string | undefined,
): string | undefined {
  if (!reference || reference.startsWith("http") || reference.startsWith("//")) {
    return undefined;
  }

  const relative = reference.replace(/^\//, "").split("?")[0].split("#")[0];
  const candidate = join(clientDirectory, relative);
  return assets.includes(candidate) ? candidate : undefined;
}

function measurePerformanceBudgets(clientDirectory: string): PerformanceBudgetResult {
  if (!statSync(clientDirectory).isDirectory()) {
    throw new Error(`Client build directory does not exist: ${clientDirectory}`);
  }

  const assets = filesUnder(clientDirectory);
  const htmlFiles = assets.filter((path) => path.endsWith(".html"));
  const initialJavaScript = new Set<string>();
  const initialCss = new Set<string>();

  for (const htmlPath of htmlFiles) {
    const html = readFileSync(htmlPath, "utf8");

    for (const match of html.matchAll(/<script[^>]+src="([^"]+)"/gi)) {
      const resolved = resolveReference(clientDirectory, assets, match[1]);
      if (resolved?.endsWith(".js")) {
        initialJavaScript.add(resolved);
      }
    }

    for (const match of html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/gi)) {
      const resolved = resolveReference(clientDirectory, assets, match[1]);
      if (resolved?.endsWith(".css")) {
        initialCss.add(resolved);
      }
    }
  }

  const javascript = [...initialJavaScript];
  const css = [...initialCss];
  const critical = [...initialJavaScript, ...initialCss];

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
