import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [chromePath, baseUrl] = process.argv.slice(2);
if (!chromePath || !baseUrl) throw new Error("Usage: bun scripts/check-mobile-scroll.mjs <chromium-path> <base-url>");

const port = 9222;
const profile = await mkdtemp(join(tmpdir(), "vitalis-scroll-chrome-"));
const chrome = spawn(chromePath, [
  "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
  "--no-first-run", "--no-default-browser-check", "--remote-allow-origins=*",
  `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank",
], { stdio: "ignore" });

let socket;
try {
  let version;
  for (let i = 0; i < 60; i++) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) { version = await response.json(); break; }
    } catch {}
    await Bun.sleep(500);
  }
  if (!version) throw new Error("Chromium DevTools endpoint did not become ready");

  const targetResponse = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(baseUrl)}`, { method: "PUT" });
  if (!targetResponse.ok) throw new Error(`Could not create Chromium page target: ${targetResponse.status}`);
  const target = await targetResponse.json();
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  let nextId = 0;
  const pending = new Map();
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    }
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || "Browser evaluation failed");
    return result.result?.value;
  };

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  let originReady = false;
  for (let attempt = 0; attempt < 80; attempt++) {
    const state = await evaluate("document.readyState");
    if (state === "complete") { originReady = true; break; }
    await Bun.sleep(250);
  }
  if (!originReady) throw new Error("Initial production page did not finish loading");
  await evaluate(`localStorage.setItem("vitalis.onboarding.v2", "1")`);

  const viewports = [[360,800],[390,844],[412,915],[768,1024]];
  const routes = [
    { path: "/flash", selector: "main h1" },
    { path: "/scan", selector: "#scan-radius" },
  ];
  let checked = 0;
  const failures = [];

  for (const locale of ["fr", "en"]) {
    await evaluate(`localStorage.setItem("eco.locale", ${JSON.stringify(locale)})`);
    for (const [width, height] of viewports) {
      await send("Emulation.setDeviceMetricsOverride", {
        width, height, deviceScaleFactor: 1, mobile: width < 600,
        screenWidth: width, screenHeight: height,
      });
      for (const route of routes) {
        await send("Page.navigate", { url: `${baseUrl}${route.path}?__vitalis_scroll_check=1` });
        let ready = false;
        for (let attempt = 0; attempt < 80; attempt++) {
          const state = await evaluate(`({
            ready: document.readyState === "complete" && !!document.querySelector(${JSON.stringify(route.selector)}),
            locale: localStorage.getItem("eco.locale")
          })`);
          if (state?.ready) { ready = true; break; }
          await Bun.sleep(250);
        }
        if (!ready) throw new Error(`Route ${route.path} did not become ready at ${width}x${height} (${locale})`);

        await evaluate(`(async () => {
          await document.fonts.ready;
          window.scrollTo(0, document.documentElement.scrollHeight);
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        })()`);

        const measurement = await evaluate(`(() => {
          const main = document.querySelector("main");
          const content = main?.firstElementChild;
          const nav = document.querySelector(".reel-bottom-nav");
          const scroller = document.scrollingElement;
          if (!main || !content || !nav || !scroller) return { error: "Missing main content, navigation, or document scroller" };
          const contentRect = content.getBoundingClientRect();
          const navRect = nav.getBoundingClientRect();
          return {
            scrollTop: scroller.scrollTop,
            maxScroll: scroller.scrollHeight - scroller.clientHeight,
            contentBottom: Math.round(contentRect.bottom * 100) / 100,
            navTop: Math.round(navRect.top * 100) / 100,
            gap: Math.round((navRect.top - contentRect.bottom) * 100) / 100,
          };
        })()`);

        checked++;
        if (measurement?.error || measurement.maxScroll - measurement.scrollTop > 2 || measurement.gap < 0) {
          failures.push({ route: route.path, locale, viewport: `${width}x${height}`, ...measurement });
        } else {
          console.log(`PASS ${route.path} ${locale} ${width}x${height}: ${measurement.gap}px clear above fixed navigation`);
        }
      }
    }
  }

  if (failures.length) {
    console.error("Mobile scroll clearance failures:");
    for (const failure of failures) console.error(JSON.stringify(failure));
    process.exitCode = 1;
  } else {
    console.log(`Verified bottom-scroll clearance for Flash and Scan in ${checked} combinations (4 viewports × 2 locales × 2 routes).`);
  }
} finally {
  socket?.close();
  chrome.kill("SIGTERM");
  await rm(profile, { recursive: true, force: true });
}
