#!/bin/sh
set -eu

PRISMA_CLI="node node_modules/prisma/build/index.js"
FIRST_MIGRATION="$(find prisma/migrations -mindepth 1 -maxdepth 1 -type d | sort | head -n 1 | xargs -n 1 basename 2>/dev/null || true)"
MIGRATE_LOG="$(mktemp)"

echo "[entrypoint] Applying Prisma migrations..."

if $PRISMA_CLI migrate deploy >"$MIGRATE_LOG" 2>&1; then
  cat "$MIGRATE_LOG"
else
  cat "$MIGRATE_LOG"

  if grep -q "Error: P3005" "$MIGRATE_LOG" && [ -n "$FIRST_MIGRATION" ]; then
    echo "[entrypoint] Existing schema detected. Baselining migration history with $FIRST_MIGRATION..."
    $PRISMA_CLI migrate resolve --applied "$FIRST_MIGRATION"

    echo "[entrypoint] Re-running Prisma migrations after baseline..."
    $PRISMA_CLI migrate deploy
  else
    rm -f "$MIGRATE_LOG"
    exit 1
  fi
fi

rm -f "$MIGRATE_LOG"

echo "[entrypoint] Ensuring bootstrap admin user exists..."
node scripts/prepare-runtime.mjs

echo "[entrypoint] Syncing canonical site content when needed..."
node scripts/sync-content.mjs

echo "[entrypoint] Starting Next.js server..."
exec node server.js
