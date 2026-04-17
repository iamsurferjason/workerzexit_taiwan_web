#!/bin/sh
set -eu

echo "[entrypoint] Applying Prisma migrations..."
node node_modules/prisma/build/index.js migrate deploy

echo "[entrypoint] Ensuring bootstrap admin user exists..."
node scripts/prepare-runtime.mjs

echo "[entrypoint] Starting Next.js server..."
exec node server.js
