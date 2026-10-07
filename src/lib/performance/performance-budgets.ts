import { gzipSync } from "node:zlib";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { PERFORMANCE_BUDGETS } from "./performance-policy";

export interface PerformanceBudgetResult {
  initialJavaScriptGzipKb: number;
  initialCssGzipKb: number;
  criticalResourcesGzipKb: number;
}

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

export function measurePerformanceBudgets(clientDirectory: string): PerformanceBudgetResult {
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
      const relative = reference.replace(/^\//, "");
      const candidate = join(clientDirectory, relative);
      if (assets.includes(candidate)) {
        referenced.add(candidate);
      }
    }
  }

  const initial = referenced.size > 0 ? [...referenced] : assets;
  const javascript = initial.filter((path) => path.endsWith(".js"));
  const css = initial.filter((path) => path.endsWith(".css"));
  const critical = initial.filter((path) => /\.(?:js|css|woff2?|ttf|webp|png|svg)$/i.test(path));

  return {
    initialJavaScriptGzipKb: javascript.reduce((sum, path) => sum + gzipKb(path), 0),
    initialCssGzipKb: css.reduce((sum, path) => sum + gzipKb(path), 0),
    criticalResourcesGzipKb: critical.reduce((sum, path) => sum + gzipKb(path), 0),
  };
}

export function assertPerformanceBudgets(result: PerformanceBudgetResult): void {
  const violations: string[] = [];

  if (result.initialJavaScriptGzipKb > PERFORMANCE_BUDGETS.initialJavaScriptGzipKb) {
    violations.push(
      `initial JavaScript gzip ${result.initialJavaScriptGzipKb.toFixed(1)} kB > ${PERFORMANCE_BUDGETS.initialJavaScriptGzipKb} kB`,
    );
  }

  if (result.initialCssGzipKb > PERFORMANCE_BUDGETS.initialCssGzipKb) {
    violations.push(
      `initial CSS gzip ${result.initialCssGzipKb.toFixed(1)} kB > ${PERFORMANCE_BUDGETS.initialCssGzipKb} kB`,
    );
  }

  if (result.criticalResourcesGzipKb > PERFORMANCE_BUDGETS.criticalResourcesGzipKb) {
    violations.push(
      `critical resources gzip ${result.criticalResourcesGzipKb.toFixed(1)} kB > ${PERFORMANCE_BUDGETS.criticalResourcesGzipKb} kB`,
    );
  }

  if (violations.length > 0) {
    throw new Error(`Performance budget exceeded: ${violations.join("; ")}`);
  }
}
