#!/bin/bash

# Runs inside the Playwright Docker container. Use bin/playwright-docker.sh instead of calling this directly.

set -euo pipefail

# jq is needed by bin/playwright-prepare-ci
if ! command -v jq > /dev/null; then
  apt-get update -qq && apt-get install -y -qq --no-install-recommends jq > /dev/null
fi

# Install Linux-native dependencies into the node_modules volume only when the lockfile changes
LOCK_MARKER=node_modules/.docker-package-lock.json
if ! cmp -s package-lock.json "$LOCK_MARKER"; then
  npm ci
  cp package-lock.json "$LOCK_MARKER"
fi

# Don't overwrite an existing secret.config.json
if [ ! -f secret.config.json ]; then
  npm run copy-secrets
fi

# playwright-prepare-ci rewrites the tracked static.config.json, so restore it when we exit
cp static.config.json /tmp/static.config.json.bak
trap 'cp /tmp/static.config.json.bak static.config.json' EXIT
npm run playwright:prepare-ci

if [ "$SKIP_BUILD" != "true" ]; then
  npm run prestart-ci
fi

npx start-server-and-test preview http-get://localhost:8080 "npm run playwright -- ${PLAYWRIGHT_ARGS}"
