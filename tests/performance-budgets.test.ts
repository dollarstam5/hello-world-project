// @vitest-environment node
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import { afterEach, describe, expect, it } from "vitest";
import {
  filesUnder,
  measureFromManifest,
  measureHtmlEntry,
  measurePerformanceBudgets,
} from "../tooling/scripts/performance-budget-measurement";
import {
  assertPerformanceBudgets,
  type PerformanceBudgetResult,
} from "@/lib/performance/performance-budget-policy";

describe("performance budget measurement", () => {
  const directories: string[] = [];

  const createClient = () => {
    const root = mkdtempSync(join(tmpdir(), "vitalis-budget-"));
    directories.push(root);
    mkdirSync(join(root, "assets"), { recursive: true });
    return root;
  };

  const write = (root: string, path: string, content: string) => {
    const target = join(root, path);
    mkdirSync(join(target, ".."), { recursive: true });
    writeFileSync(target, content);
    return target;
  };

  const gzipKb = (content: string) => gzipSync(Buffer.from(content), { level: 9 }).length / 1024;

  afterEach(() => {
    for (const directory of directories.splice(0)) {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("counts entry scripts and modulepreloads once, plus stylesheets", () => {
    const root = createClient();
    write(root, "assets/app.js", "window.app = true;");
    write(root, "assets/vendor.js", "window.vendor = true;");
    write(root, "assets/site.css", "body { color: black; }");
    const html = write(
      root,
      "index.html",
      '<script type="module" src="/assets/app.js"></script>' +
        '<link rel="modulepreload" href="/assets/vendor.js">' +
        '<link rel="modulepreload" href="/assets/app.js">' +
        '<link rel="stylesheet" href="/assets/site.css">',
    );

    const result = measureHtmlEntry(html, root, new Set(filesUnder(root)));
    expect(result.initialJavaScriptGzipKb).toBeCloseTo(
      gzipKb("window.app = true;") + gzipKb("window.vendor = true;"),
    );
    expect(result.initialCssGzipKb).toBeGreaterThan(0);
    expect(result.criticalResourcesGzipKb).toBeGreaterThan(result.initialJavaScriptGzipKb);
  });

  it("counts inline JavaScript in the initial JavaScript and critical budgets", () => {
    const root = createClient();
    const html = write(root, "index.html", "<script>window.inlineVitalis = 'ready';</script>");
    const result = measureHtmlEntry(html, root, new Set(filesUnder(root)));
    expect(result.initialJavaScriptGzipKb).toBeCloseTo(gzipKb("window.inlineVitalis = 'ready';"));
    expect(result.criticalResourcesGzipKb).toBe(result.initialJavaScriptGzipKb);
  });

  it("fails when any application HTML document has no initial JavaScript entry", () => {
    const root = createClient();
    write(root, "assets/app.js", "window.app = true;");
    write(root, "index.html", '<script type="module" src="/assets/app.js"></script>');
    write(root, "admin/index.html", "<main>Static shell</main>");
    expect(() => measurePerformanceBudgets(root)).toThrow(/no initial JavaScript entry/);
  });

  it("fails when an HTML document references a missing local asset", () => {
    const root = createClient();
    write(root, "index.html", '<script type="module" src="/assets/missing.js"></script>');
    expect(() => measurePerformanceBudgets(root)).toThrow(/Referenced build asset is missing/);
  });

  it("measures all HTML pages and keeps the maximum page instead of skipping one", () => {
    const root = createClient();
    write(root, "assets/small.js", "window.small = true;");
    write(root, "assets/large.js", "window.large = '" + "large".repeat(2000) + "';");
    write(root, "index.html", '<script type="module" src="/assets/small.js"></script>');
    write(root, "flash/index.html", '<script type="module" src="/assets/large.js"></script>');

    const result = measurePerformanceBudgets(root);
    const large = measureHtmlEntry(join(root, "flash/index.html"), root, new Set(filesUnder(root)));
    expect(result.initialJavaScriptGzipKb).toBe(large.initialJavaScriptGzipKb);
  });

  it("uses static manifest imports and excludes dynamic imports from the initial graph", () => {
    const root = createClient();
    const entry = "window.entry = true;";
    const shared = "window.shared = true;";
    write(root, "assets/entry.js", entry);
    write(root, "assets/shared.js", shared);
    write(root, "assets/lazy.js", "window.lazy = true;");
    write(
      root,
      "manifest.json",
      JSON.stringify({
        "entry.js": {
          file: "assets/entry.js",
          isEntry: true,
          imports: ["shared.js"],
          dynamicImports: ["lazy.js"],
        },
        "shared.js": { file: "assets/shared.js" },
        "lazy.js": { file: "assets/lazy.js" },
      }),
    );

    const result = measureFromManifest(root, new Set(filesUnder(root)));
    expect(result?.initialJavaScriptGzipKb).toBeCloseTo(gzipKb(entry) + gzipKb(shared));
  });

  it("fails when a manifest entry or static import points to a missing built file", () => {
    const root = createClient();
    write(
      root,
      "manifest.json",
      JSON.stringify({
        "entry.js": { file: "assets/missing.js", isEntry: true },
      }),
    );
    expect(() => measureFromManifest(root, new Set(filesUnder(root)))).toThrow(
      /Referenced build asset is missing/,
    );
  });

  it("uses the manifest only when there are no application HTML documents", () => {
    const root = createClient();
    write(root, "assets/entry.js", "window.entry = true;");
    write(
      root,
      "manifest.json",
      JSON.stringify({
        "entry.js": { file: "assets/entry.js", isEntry: true },
      }),
    );
    expect(measurePerformanceBudgets(root).initialJavaScriptGzipKb).toBeGreaterThan(0);
  });
});

describe("performance budgets policy", () => {
  const withinBudgets: PerformanceBudgetResult = {
    initialJavaScriptGzipKb: 100,
    initialCssGzipKb: 20,
    criticalResourcesGzipKb: 250,
  };

  it("accepts measurements inside all budgets", () => {
    expect(() => assertPerformanceBudgets(withinBudgets)).not.toThrow();
  });

  it("rejects a critical JavaScript budget regression", () => {
    expect(() =>
      assertPerformanceBudgets({ ...withinBudgets, initialJavaScriptGzipKb: 251 }),
    ).toThrow(/initial JavaScript gzip/);
  });

  it("rejects non-finite measurements instead of silently passing", () => {
    expect(() =>
      assertPerformanceBudgets({ ...withinBudgets, initialCssGzipKb: Number.NaN }),
    ).toThrow(/finite, non-negative number/);
  });

  it("rejects negative measurements", () => {
    expect(() =>
      assertPerformanceBudgets({ ...withinBudgets, criticalResourcesGzipKb: -1 }),
    ).toThrow(/finite, non-negative number/);
  });
});
