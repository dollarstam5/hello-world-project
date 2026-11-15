import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
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

function attribute(tag: string, name: string): string | undefined {
  const attributes = tag.matchAll(/([^\s=]+)\s*=\s*["']([^"']+)["']/g);
  for (const match of attributes) {
    if (match[1].toLowerCase() === name.toLowerCase()) return match[2];
  }
  return undefined;
}

function resolveReference(
  clientDirectory: string,
  assets: Set<string>,
  reference: string | undefined,
): string | undefined {
  if (!reference || /^(?:[a-z]+:)?\/\//i.test(reference) || reference.startsWith("data:")) {
    return undefined;
  }

  const relative = reference.replace(/^\//, "").split("?")[0].split("#")[0];
  const candidate = join(clientDirectory, relative);
  if (assets.has(candidate)) return candidate;

  throw new Error(
    "Referenced build asset is missing: " + reference + " (resolved to " + candidate + ")",
  );
}

function measureHtmlEntry(
  htmlPath: string,
  clientDirectory: string,
  assets: Set<string>,
): PerformanceBudgetResult | undefined {
  const html = readFileSync(htmlPath, "utf8");
  const initialJavaScript = new Set<string>();
  const initialCss = new Set<string>();
  const criticalResources = new Set<string>();

  for (const match of html.matchAll(/<script\b[^>]*>/gi)) {
    const tag = match[0];
    const resolved = resolveReference(clientDirectory, assets, attribute(tag, "src"));
    const scriptType = attribute(tag, "type")?.toLowerCase();

    if (resolved && (scriptType === "module" || /\.(?:m?js)$/i.test(resolved))) {
      initialJavaScript.add(resolved);
      criticalResources.add(resolved);
    }
  }

  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = match[0];
    const resolved = resolveReference(clientDirectory, assets, attribute(tag, "href"));
    const rel = attribute(tag, "rel")?.toLowerCase().split(/\s+/) ?? [];
    const resourceType = attribute(tag, "as")?.toLowerCase();

    if (resolved && /\.css$/i.test(resolved) && rel.includes("stylesheet")) {
      initialCss.add(resolved);
      criticalResources.add(resolved);
    }

    const isModulePreload = rel.includes("modulepreload");
    const isScriptPreload = rel.includes("preload") && resourceType === "script";
    if (resolved && (isModulePreload || isScriptPreload)) {
      initialJavaScript.add(resolved);
      criticalResources.add(resolved);
    } else if (
      resolved &&
      rel.includes("preload") &&
      /\.(?:css|woff2?|ttf|webp|png|jpe?g|avif|svg)$/i.test(resolved)
    ) {
      criticalResources.add(resolved);
    }
  }

  if (initialJavaScript.size === 0) return undefined;

  console.log(
    JSON.stringify({
      type: "performance-budget-assets",
      page: htmlPath.replace(clientDirectory + "/", ""),
      initialJavaScript: [...initialJavaScript].map((path) => ({
        file: path.replace(clientDirectory + "/", ""),
        gzipKb: Number(gzipKb(path).toFixed(2)),
      })),
    }),
  );

  const javascript = [...initialJavaScript];
  const css = [...initialCss];
  const critical = [...criticalResources];

  return {
    initialJavaScriptGzipKb: javascript.reduce((sum, path) => sum + gzipKb(path), 0),
    initialCssGzipKb: css.reduce((sum, path) => sum + gzipKb(path), 0),
    criticalResourcesGzipKb: critical.reduce((sum, path) => sum + gzipKb(path), 0),
  };
}

function measureFromManifest(
  clientDirectory: string,
  assets: Set<string>,
): PerformanceBudgetResult | undefined {
  const manifestPath = [
    join(clientDirectory, ".vite/manifest.json"),
    join(clientDirectory, "manifest.json"),
  ].find(existsSync);
  if (!manifestPath) return undefined;

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Record<
    string,
    {
      file?: string;
      isEntry?: boolean;
      imports?: string[];
      css?: string[];
    }
  >;
  const entries = Object.entries(manifest).filter(([, entry]) => entry.isEntry);
  if (entries.length === 0) {
    throw new Error("Vite manifest contains no entry modules: " + manifestPath);
  }

  const results: PerformanceBudgetResult[] = [];
  for (const [entryKey] of entries) {
    const javascript = new Set<string>();
    const css = new Set<string>();
    const critical = new Set<string>();
    const visited = new Set<string>();

    const visit = (key: string) => {
      if (visited.has(key)) return;
      visited.add(key);
      const entry = manifest[key];
      if (!entry) throw new Error("Missing imported entry in Vite manifest: " + key);

      const file = resolveReference(clientDirectory, assets, entry.file);
      if (file && /\.(?:m?js)$/i.test(file)) {
        javascript.add(file);
        critical.add(file);
      }
      for (const stylesheet of entry.css ?? []) {
        const cssFile = resolveReference(clientDirectory, assets, stylesheet);
        if (cssFile) {
          css.add(cssFile);
          critical.add(cssFile);
        }
      }
      for (const imported of entry.imports ?? []) visit(imported);
    };

    visit(entryKey);
    results.push({
      initialJavaScriptGzipKb: [...javascript].reduce((sum, path) => sum + gzipKb(path), 0),
      initialCssGzipKb: [...css].reduce((sum, path) => sum + gzipKb(path), 0),
      criticalResourcesGzipKb: [...critical].reduce((sum, path) => sum + gzipKb(path), 0),
    });
  }

  return results.reduce(
    (worst, current) => ({
      initialJavaScriptGzipKb: Math.max(
        worst.initialJavaScriptGzipKb,
        current.initialJavaScriptGzipKb,
      ),
      initialCssGzipKb: Math.max(worst.initialCssGzipKb, current.initialCssGzipKb),
      criticalResourcesGzipKb: Math.max(
        worst.criticalResourcesGzipKb,
        current.criticalResourcesGzipKb,
      ),
    }),
    {
      initialJavaScriptGzipKb: 0,
      initialCssGzipKb: 0,
      criticalResourcesGzipKb: 0,
    },
  );
}

function measurePerformanceBudgets(clientDirectory: string): PerformanceBudgetResult {
  if (!statSync(clientDirectory).isDirectory()) {
    throw new Error("Client build directory does not exist: " + clientDirectory);
  }

  const assets = new Set(filesUnder(clientDirectory));
  const htmlFiles = [...assets].filter(
    (path) =>
      path.endsWith(".html") &&
      !path.endsWith("/offline.html") &&
      path !== join(clientDirectory, "offline.html"),
  );

  const pageResults = htmlFiles
    .map((htmlPath) => measureHtmlEntry(htmlPath, clientDirectory, assets))
    .filter((result): result is PerformanceBudgetResult => result !== undefined);

  const results =
    pageResults.length > 0
      ? pageResults
      : [measureFromManifest(clientDirectory, assets)].filter(
          (result): result is PerformanceBudgetResult => result !== undefined,
        );

  if (results.length === 0) {
    throw new Error(
      "No initial JavaScript entry or preloaded module was found in HTML or the Vite client manifest. " +
        "Inspected HTML documents: " +
        (htmlFiles.length > 0
          ? htmlFiles.map((path) => path.replace(clientDirectory + "/", "")).join(", ")
          : "no application HTML entry documents") +
        ".",
    );
  }

  return results.reduce(
    (worst, current) => ({
      initialJavaScriptGzipKb: Math.max(
        worst.initialJavaScriptGzipKb,
        current.initialJavaScriptGzipKb,
      ),
      initialCssGzipKb: Math.max(worst.initialCssGzipKb, current.initialCssGzipKb),
      criticalResourcesGzipKb: Math.max(
        worst.criticalResourcesGzipKb,
        current.criticalResourcesGzipKb,
      ),
    }),
    {
      initialJavaScriptGzipKb: 0,
      initialCssGzipKb: 0,
      criticalResourcesGzipKb: 0,
    },
  );
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
  throw new Error("No client build output found. Expected one of: " + candidates.join(", "));
}

const result = measurePerformanceBudgets(clientDirectory);
console.log(
  JSON.stringify({
    directory: join(process.cwd(), clientDirectory),
    compression: "gzip level 9",
    aggregation: "maximum per HTML entry page (not sum across routes)",
    ...result,
  }),
);
assertPerformanceBudgets(result);
