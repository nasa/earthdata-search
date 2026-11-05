#!/bin/bash

# Runs the Playwright tests inside the same Docker image CI uses, so screenshots render
# identically to GitHub Actions. Any arguments are passed through to `playwright test`.
#
# Examples:
#   bin/playwright-docker.sh
#   bin/playwright-docker.sh --update-snapshots --grep @screenshot
#   bin/playwright-docker.sh tests/e2e/map/map_shapefile.spec.js --project chromium
#
# Environment variables:
#   SKIP_BUILD=true          Reuse the existing static/dist instead of rebuilding
#   DOCKER_PLATFORM=<value>  Defaults to linux/amd64 to match GitHub runners. On Apple Silicon
#                            this runs under emulation (slower); linux/arm64 is faster but may
#                            render slightly differently than CI.

set -euo pipefail

cd "$(dirname "$0")/.."

PLAYWRIGHT_VERSION=$(node -p "require('./package-lock.json').packages['node_modules/@playwright/test'].version")
IMAGE="mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble"
PLATFORM="${DOCKER_PLATFORM:-linux/amd64}"

# Keep Linux-native node_modules in a Docker volume so they don't clobber the host's node_modules
NODE_MODULES_VOLUME="edsc-playwright-node-modules-${PLATFORM//\//-}"

# Quote the arguments so they survive being passed through the container's shell
PLAYWRIGHT_ARGS=""
if [ "$#" -gt 0 ]; then
  PLAYWRIGHT_ARGS=$(printf '%q ' "$@")
fi

TTY_FLAGS=()
if [ -t 0 ] && [ -t 1 ]; then
  TTY_FLAGS=(-it)
fi

echo "Running Playwright in ${IMAGE} (${PLATFORM})"

if [ "$(uname -m)" = "arm64" ] && [ "$PLATFORM" = "linux/amd64" ]; then
  echo "Note: Running amd64 on Apple Silicon. If browsers crash with 'qemu: uncaught target signal', enable"
  echo "Docker Desktop > Settings > General > 'Use Rosetta for x86_64/amd64 emulation on Apple Silicon'."
fi

# The `+` expansion avoids an unbound variable error for empty arrays in macOS's bash 3.2
docker run --rm --init --ipc=host ${TTY_FLAGS[@]+"${TTY_FLAGS[@]}"} \
  --platform "$PLATFORM" \
  -v "$PWD":/work \
  -v "$NODE_MODULES_VOLUME":/work/node_modules \
  -w /work \
  -e HOME=/root \
  -e SKIP_BUILD="${SKIP_BUILD:-false}" \
  -e PLAYWRIGHT_ARGS="$PLAYWRIGHT_ARGS" \
  "$IMAGE" \
  bash bin/playwright-docker-entrypoint.sh
