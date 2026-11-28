import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [chromePath, baseUrl] = process.argv.slice(2);
if (!chromePath || !baseUrl) {
  throw new Error("Usage: bun scripts/check-mobile-scroll.mjs <chromium-path> <base-url>");
}

const profile = await mkdtemp(join(tmpdir(), "vitalis-scroll-chrome-"));
const portFile = join(profile, "DevToolsActivePort");
let port;
const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-allow-origins=*",
    "--remote-debugging-port=0",
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { stdio: "ignore", detached: true },
);

let socket;
try {
  let version;
  for (let i = 0; i < 60; i++) {
    try {
      const activePort = (await readFile(portFile, "utf8")).split("\n")[0].trim();
      port = Number(activePort);
      if (!Number.isInteger(port) || port <= 0) throw new Error("Invalid Chromium debug port");
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) {
        version = await response.json();
        break;
      }
    } catch {}
    await Bun.sleep(500);
  }
  if (!version) {
    throw new Error("Chromium DevTools endpoint did not become ready");
  }

  const targetResponse = await fetch(`http://127.0.0.1:${port}/json/new?${baseUrl}`, {
    method: "PUT",
  });
  if (!targetResponse.ok) {
    throw new Error(`Could not create Chromium page target: ${targetResponse.status}`);
  }
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
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++nextId;
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });
  const evaluate = async (expression) => {
    let result;
    for (let attempt = 0; attempt < 30; attempt++) {
      try {
        result = await send("Runtime.evaluate", {
          expression,
          returnByValue: true,
          awaitPromise: true,
        });
        break;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (!message.includes("Cannot find default execution context") || attempt === 29) {
          throw error;
        }
        // Page.navigate destroys the previous document context before the
        // next one is created. Retry only this transient CDP navigation race.
        await Bun.sleep(100);
      }
    }
    if (result.exceptionDetails) {
      throw new Error(
        result.exceptionDetails.exception?.description ||
          result.exceptionDetails.text ||
          "Browser evaluation failed",
      );
    }
    return result.result?.value;
  };

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  // Explicitly navigate away from the initial about:blank target before
  // touching origin-scoped storage. A complete about:blank document has an
  // opaque origin and Chromium correctly denies localStorage access.
  await send("Page.navigate", { url: baseUrl });
  const expectedOrigin = new URL(baseUrl).origin;
  let originReady = false;
  for (let attempt = 0; attempt < 80; attempt++) {
    const state = await evaluate("({ ready: document.readyState, origin: location.origin })");
    if (state?.ready === "complete" && state.origin === expectedOrigin) {
      originReady = true;
      break;
    }
    await Bun.sleep(250);
  }
  if (!originReady) {
    throw new Error(`Initial production page did not become ready at origin ${expectedOrigin}`);
  }
  await evaluate('localStorage.setItem("vitalis.onboarding.v2", "1")');

  const viewports = [
    [360, 800],
    [390, 844],
    [412, 915],
    [768, 1024],
  ];
  const routes = [
    { path: "/flash", selector: "main h1" },
    { path: "/scan", selector: "#scan-need" },
  ];
  let checked = 0;
  const failures = [];

  for (const locale of ["fr", "en"]) {
    await evaluate(`localStorage.setItem("eco.locale", ${JSON.stringify(locale)})`);
    for (const [width, height] of viewports) {
      await send("Emulation.setDeviceMetricsOverride", {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: width < 600,
        screenWidth: width,
        screenHeight: height,
      });
      for (const route of routes) {
        await send("Page.navigate", {
          url: `${baseUrl}${route.path}?__vitalis_scroll_check=1`,
        });
        let ready = false;
        for (let attempt = 0; attempt < 80; attempt++) {
          const state = await evaluate(`({
            ready: document.readyState === "complete" && !!document.querySelector(${JSON.stringify(route.selector)}),
            locale: localStorage.getItem("eco.locale")
          })`);
          const feedReady = route.path !== "/flash" || await evaluate("!!document.querySelector('[data-flash-feed-hydrated=true]')");
          if (state?.ready && feedReady) {
            ready = true;
            break;
          }
          await Bun.sleep(250);
        }
        if (!ready) {
          throw new Error(
            `Route ${route.path} did not become ready at ${width}x${height} (${locale})`,
          );
        }

        await evaluate(`(async () => {
          await document.fonts.ready;
          const scroller = document.scrollingElement;
          scroller.style.scrollBehavior = "auto";

          // Flash can finish hydrating cards after the route's first paint.
          // Wait for document height to settle before calculating the bottom.
          let previousHeight = -1;
          let stableFrames = 0;
          for (let attempt = 0; attempt < 20 && stableFrames < 3; attempt++) {
            await new Promise(resolve => setTimeout(resolve, 200));
            const currentHeight = scroller.scrollHeight;
            stableFrames = currentHeight === previousHeight ? stableFrames + 1 : 0;
            previousHeight = currentHeight;
          }

          // Re-apply the bottom position after layout frames so late content
          // cannot leave the measurement halfway down the document.
          for (let attempt = 0; attempt < 5; attempt++) {
            scroller.scrollTop = scroller.scrollHeight;
            await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
            if (scroller.scrollHeight - scroller.clientHeight - scroller.scrollTop <= 2) break;
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        })()`);

        // Follow hydration/router restoration with actual touch gestures,
        // rather than relying only on a scripted scrollTop assignment.
        for (let gesture = 0; gesture < 3; gesture++) {
          await send("Input.synthesizeScrollGesture", {
            x: Math.floor(width / 2),
            y: Math.floor(height * 0.65),
            yDistance: -Math.max(height * 3, 2400),
            speed: 1200,
            gestureSourceType: "touch",
          });
          const atBottom = await evaluate("(() => { const s = document.scrollingElement; return s.scrollHeight - s.clientHeight - s.scrollTop <= 2; })()");
          if (atBottom) break;
        }

        const measurement = await evaluate(`(() => {
          const main = document.querySelector("main");
          const content = main?.firstElementChild;
          const nav = document.querySelector(".reel-bottom-nav");
          const navBar = nav?.querySelector(".reel-bottom-nav__bar");
          const scroller = document.scrollingElement;
          if (!main || !content || !nav || !navBar || !scroller) return { error: "Missing main content, navigation surface, or document scroller" };
          const contentRect = content.getBoundingClientRect();
          const navRect = nav.getBoundingClientRect();
          const navStyle = getComputedStyle(navBar);
          return {
            scrollTop: scroller.scrollTop,
            maxScroll: scroller.scrollHeight - scroller.clientHeight,
            contentBottom: Math.round(contentRect.bottom * 100) / 100,
            navTop: Math.round(navRect.top * 100) / 100,
            gap: Math.round((navRect.top - contentRect.bottom) * 100) / 100,
            navBackground: navStyle.backgroundColor,
            navBorderRadius: navStyle.borderRadius,
          };
        })()`);

        checked++;
        if (
          measurement?.error ||
          measurement.maxScroll - measurement.scrollTop > 2 ||
          measurement.gap < 0 ||
          measurement.navBackground === "transparent" ||
          measurement.navBackground === "rgba(0, 0, 0, 0)" ||
          measurement.navBorderRadius === "0px"
        ) {
          failures.push({
            route: route.path,
            locale,
            viewport: `${width}x${height}`,
            ...measurement,
          });
        } else {
          console.log(
            `PASS ${route.path} ${locale} ${width}x${height}: ${measurement.gap}px clear above fixed navigation`,
          );
        }
      }
    }
  }

  if (failures.length) {
    console.error("Mobile scroll clearance failures:");
    for (const failure of failures) {
      console.error(JSON.stringify(failure));
    }
    process.exitCode = 1;
  } else {
    console.log(
      `Verified bottom-scroll clearance for Flash and Scan in ${checked} combinations (4 viewports × 2 locales × 2 routes).`,
    );
  }
} finally {
  socket?.close();
  if (chrome.pid) {
    try {
      process.kill(-chrome.pid, "SIGTERM");
    } catch {
      chrome.kill("SIGTERM");
    }
    if (chrome.exitCode === null && chrome.signalCode === null) {
      await new Promise((resolve) => chrome.once("exit", resolve));
    }
  }
  await rm(profile, { recursive: true, force: true });
}
