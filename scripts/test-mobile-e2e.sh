#!/usr/bin/env bash
set -euo pipefail

HOST="127.0.0.1"
PORT="4173"
BASE_URL="http://${HOST}:${PORT}"
SERVER_LOG="${TMPDIR:-/tmp}/vitalis-e2e.log"
OUTPUT_DIR="${GITHUB_WORKSPACE:-.}/artifacts/mobile-smoke"
mkdir -p "$OUTPUT_DIR"

# Build once before starting the development server so smoke tests exercise
# the generated route tree and all lazy route modules.
bun run build:check >/dev/null
bun run dev --host "$HOST" --port "$PORT" >"$SERVER_LOG" 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT

for _ in {1..30}; do
  if curl --silent --fail "$BASE_URL/" >/dev/null; then
    break
  fi
  sleep 1
done

if ! curl --silent --fail "$BASE_URL/" >/dev/null; then
  cat "$SERVER_LOG"
  exit 1
fi

# Keep the browser matrix focused on the five core Vitalis routes. Each route
# is checked at a phone portrait, reference phone, and tablet viewport.
for route in "/" "/flash" "/scan" "/reel" "/radar"; do
  selector="#home-engines-title"
  case "$route" in
    "/flash") selector="main h1" ;;
    "/scan") selector="#scan-radius" ;;
    "/reel") selector=".reel-proximity" ;;
    "/radar") selector="#radar-query" ;;
  esac

  for viewport in "360,800" "390,844" "768,1024"; do
    output="$OUTPUT_DIR/vitalis-route-${route#/}-${viewport//,/-}.png"
    if [[ "$route" == "/" ]]; then
      output="$OUTPUT_DIR/vitalis-route-home-${viewport//,/-}.png"
    fi
    bunx playwright screenshot \
      --browser=chromium \
      --viewport-size="$viewport" \
      --wait-for-selector="$selector" \
      "$BASE_URL$route?__vitalis_smoke=1" \
      "$output" >/dev/null
    test -s "$output"
  done
done

echo "Mobile E2E smoke validation passed for Home, Flash, Scan, Reel and Radar at three target viewports each."
