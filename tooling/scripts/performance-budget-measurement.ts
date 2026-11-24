import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import type { PerformanceBudgetResult } from "../src/platform/performance/performance-budget-policy";

export function filesUnder(directory: string): string[] {
  const entries = readdirSync(directory, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  });
}

function gzipBytes(content: string | Buffer): number {
  return gzipSync(content, { level: 9 }).length / 1024;
}

function gzipKb(path: string): number {
  return gzipBytes(readFileSync(path));
}

function attribute(tag: string, name: string): string | undefined {
  for (const match of tag.matchAll(/([^\s=]+)\s*=\s*["']([^"']*)["']/g)) {
    if (match[1].toLowerCase() === name.toLowerCase()) return match[2];
  }
  return undefined;
}

function resolveReference(
  clientDirectory: string,
  assets: Set<string>,
  reference: string | undefined,
): string | undefined {
  if (
    !reference ||
    /^(?:[a-z]+:)?\/\//i.test(reference) ||
    reference.startsWith("data:") ||
    reference.startsWith("#")
  ) {
    return undefined;
  }

  const relative = reference.replace(/^\//, "").split("?")[0].split("#")[0];
  const candidate = join(clientDirectory, relative);
  if (assets.has(candidate)) return candidate;

  throw new Error(
    "Referenced build asset is missing: " + reference + " (resolved to " + candidate + ")",
  );
}

export function measureHtmlEntry(
  htmlPath: string,
  clientDirectory: string,
  assets: Set<string>,
): PerformanceBudgetResult {
  const html = readFileSync(htmlPath, "utf8");
  const initialJavaScript = new Set<string>();
  const initialCss = new Set<string>();
  const criticalResources = new Set<string>();
  const inlineJavaScript: string[] = [];

  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    const tag = "<script " + match[1] + ">";
    const source = attribute(tag, "src");
    const type = attribute(tag, "type")?.toLowerCase();
    const resolved = resolveReference(clientDirectory, assets, source);

    if (resolved && (type === "module" || /\.(?:m?js)$/i.test(resolved))) {
      initialJavaScript.add(resolved);
      criticalResources.add(resolved);
    } else if (
      !source &&
      match[2].trim() &&
      (!type || type === "module" || /^(?:text|application)\/javascript$/i.test(type))
    ) {
      inlineJavaScript.push(match[2]);
    }
  }

  // Include external script tags even when authored as void-like tags.
  for (const match of html.matchAll(/<script\b[^>]*>/gi)) {
    const tag = match[0];
    const resolved = resolveReference(clientDirectory, assets, attribute(tag, "src"));
    const type = attribute(tag, "type")?.toLowerCase();
    if (resolved && (type === "module" || /\.(?:m?js)$/i.test(resolved))) {
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

  if (initialJavaScript.size === 0 && inlineJavaScript.length === 0) {
    throw new Error("HTML document has no initial JavaScript entry or module preload: " + htmlPath);
  }

  const javascript = [...initialJavaScript];
  const css = [...initialCss];
  const critical = [...criticalResources];
  const inlineGzip = inlineJavaScript.reduce((sum, source) => sum + gzipBytes(source), 0);

  console.log(
    JSON.stringify({
      type: "performance-budget-assets",
      page: htmlPath.replace(clientDirectory + "/", ""),
      initialJavaScript: javascript.map((path) => ({
        file: path.replace(clientDirectory + "/", ""),
        gzipKb: Number(gzipKb(path).toFixed(2)),
      })),
      inlineJavaScriptCount: inlineJavaScript.length,
    }),
  );

  return {
    initialJavaScriptGzipKb: javascript.reduce((sum, path) => sum + gzipKb(path), 0) + inlineGzip,
    initialCssGzipKb: css.reduce((sum, path) => sum + gzipKb(path), 0),
    criticalResourcesGzipKb: critical.reduce((sum, path) => sum + gzipKb(path), 0) + inlineGzip,
  };
}

interface ManifestEntry {
  file?: string;
  isEntry?: boolean;
  imports?: string[];
  css?: string[];
  dynamicImports?: string[];
}

export function measureFromManifest(
  clientDirectory: string,
  assets: Set<string>,
): PerformanceBudgetResult | undefined {
  const manifestPath = [
    join(clientDirectory, ".vite/manifest.json"),
    join(clientDirectory, "manifest.json"),
  ].find(existsSync);
  if (!manifestPath) return undefined;

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Record<string, ManifestEntry>;
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
      // Only static imports belong to the initial graph; dynamicImports stay lazy.
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

export function measurePerformanceBudgets(clientDirectory: string): PerformanceBudgetResult {
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

  const results =
    htmlFiles.length > 0
      ? htmlFiles.map((htmlPath) => measureHtmlEntry(htmlPath, clientDirectory, assets))
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
