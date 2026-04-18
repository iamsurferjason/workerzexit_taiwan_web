# Workerz Exit Taiwan Deployment Runbook

## Current Production Baseline

- Git branch: `main`
- Docker image: `iamsurferjason/workerzexit_app:latest`
- Current known-good image digest: `sha256:fa06e395b75dac3c6f14ac088a4480ece4470276a59e71f6266819bf0e115c02`
- App port in container: `3010`
- Primary compose file: `docker-compose.yml`

## What The Container Does On Startup

The app container now performs these steps automatically:

1. Run `prisma migrate deploy`
2. If Prisma returns `P3005`, baseline the existing schema with the first migration
3. Ensure the bootstrap admin account exists
4. Sync canonical local content into the production database when `CONTENT_SYNC_VERSION` changes
5. Start the Next.js standalone server

This logic lives in:

- [docker-entrypoint.sh](/Users/jasonchen/claude_code/workerzexit_taiwan_web/docker-entrypoint.sh)
- [scripts/prepare-runtime.mjs](/Users/jasonchen/claude_code/workerzexit_taiwan_web/scripts/prepare-runtime.mjs)
- [scripts/sync-content.mjs](/Users/jasonchen/claude_code/workerzexit_taiwan_web/scripts/sync-content.mjs)

## Canonical Content Sync

Production content is now treated as "sync from local canonical source" instead of "manually rebuild in the NAS database".

On container startup, these scripts run in order:

1. `prisma/seed.ts`
2. `prisma/seed-images.ts`
3. `prisma/seed-banners.ts`
4. `prisma/seed-promotions.ts`

The sync is guarded by `CONTENT_SYNC_VERSION`.

- If the DB already has the same `content_sync_version`, sync is skipped.
- If you want to force a re-sync, change the value in `docker-compose.yml` or Portainer env settings.

Current default:

- `CONTENT_SYNC_VERSION=local-full-sync-2026-04-18`

## Admin Login

Default bootstrap admin:

- Email: `admin@workerzexit.tw`
- Password: `WorkerzExit2024!`

Relevant env vars:

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_NAME`

Important auth fixes already applied:

- `trustHost: true` in Auth.js config
- middleware reads secure auth cookie in HTTPS / proxied environments

Relevant files:

- [src/lib/auth.ts](/Users/jasonchen/claude_code/workerzexit_taiwan_web/src/lib/auth.ts)
- [src/middleware.ts](/Users/jasonchen/claude_code/workerzexit_taiwan_web/src/middleware.ts)

## Media Assets

Local media assets under `public/` are now committed into git and included in deployment builds.

This matters because earlier deployments were built from a workspace that had local files not tracked in git, which caused NAS output to differ from local output.

## Portainer Redeploy Procedure

Use this when you want NAS to pull the latest known-good build.

1. Open the existing stack in Portainer.
2. Confirm image tag is still `iamsurferjason/workerzexit_app:latest`.
3. Confirm compose path is `docker-compose.yml`.
4. Redeploy the existing stack.
5. Check `workerzexit_app` logs.

Expected healthy startup log pattern:

```text
[entrypoint] Applying Prisma migrations...
[entrypoint] Ensuring bootstrap admin user exists...
[entrypoint] Syncing canonical site content when needed...
[content-sync] Running prisma/seed.ts...
[content-sync] Running prisma/seed-images.ts...
[content-sync] Running prisma/seed-banners.ts...
[content-sync] Running prisma/seed-promotions.ts...
[content-sync] Content sync completed at version ...
[entrypoint] Starting Next.js server...
```

## Quick Verification Checklist

After redeploy, verify:

- `/admin/login` loads
- admin login succeeds
- `/products` shows correct product list
- `/collections/waist-tools` shows varied product images
- front page banners are correct
- `workerzexit_app` logs contain `Content sync completed`

## Known Failure Modes

### `Server error / problem with server configuration`

Usually means Auth.js failed during credentials flow.

Check:

- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- auth route log output
- secure cookie handling in middleware

### `P3005 The database schema is not empty`

This is handled automatically now.

The container should baseline the first migration and retry.

### `Cannot find module 'effect'`

This came from Prisma CLI dependencies missing in the runtime image.

Resolved by installing runtime dependencies in the runner image.

### `Cannot find module '/app/node_modules/tsx/dist/cli.mjs'`

This came from content sync calling TypeScript seed scripts without `tsx` in the runtime image.

Resolved by installing with:

- `npm ci --include=dev`

### Login succeeds but redirects back to `/admin/login`

This was caused by middleware reading the wrong cookie name in HTTPS deployment.

Resolved by:

- `secureCookie: req.nextUrl.protocol === 'https:'`

## If You Need To Force Another Full Content Refresh

Change:

- `CONTENT_SYNC_VERSION`

Example:

- `local-full-sync-2026-04-18-v2`

Then redeploy again. The app will treat that as a new content version and re-run the sync scripts.

## Recommendation Going Forward

- Keep all production-needed `public/` assets committed to git.
- Keep database bootstrap logic inside the container startup path.
- Use `CONTENT_SYNC_VERSION` whenever you intentionally want production DB content to be overwritten from local canonical data.
- Treat Portainer's own status errors separately from app health. App health should be judged by container state, logs, and actual page responses.
