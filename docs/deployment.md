# Vite deployment checklist

This branch combines the changes from PRs #19–#23. Review and deploy the combined
branch rather than merging the older overlapping branches independently.

## Before merging

1. Approve the latest Vercel preview deployment if its check requests authorization.
   A member of **David Melo's projects** must approve it. This is separate from
   whether the build or tests pass; approval alone is not deployment validation.
2. Confirm the Vercel project's Root Directory is the repository root and its
   production branch is `main`. Use Node **24.x** (also declared in `package.json`).
3. The committed `vercel.json` selects Vite, installs from the frozen Yarn lockfile,
   runs `yarn run validate`, and publishes `dist/`. Its SPA rewrite supports direct loads
   and refreshes of client-side routes. Do not change the existing CRA project's
   global output directory to `dist` before the migration branch is deployed.
4. Add `VITE_GA_MEASUREMENT_ID` to the Vercel project's **Production** environment.
   The previous production property was `G-75H31NF76J`; confirm that it is still
   the intended property. Configure **Preview** only if preview visits should be
   tracked (prefer a separate test property). Rebuild after changing variables.
5. The four `VITE_GQL_API_*` / `VITE_AUTH_*` names in `example.env` are legacy
   examples with no active source consumers. They do not need values for this
   calculator. All `VITE_*` values used by client code are public: never put
   passwords, service tokens, or private API keys in them.
6. Verify the latest GitHub **Validate calculator** check and Vercel preview are
   successful. Make that GitHub check required in the repository's branch rules
   if it should enforce merge protection; adding a workflow does not change rules.

## Preview smoke test

- Load the calculator with existing saved settings and with fresh browser storage.
- Select a product, machine, and recipe; check resource totals and product flows.
- Create and delete linked nodes and check the graph and summary stay consistent.
- Toggle the theme, reload, and check that it persists.
- Check narrow/mobile layout, icons, fonts, and the browser console.
- Load a client-side URL directly and refresh it; verify SPA routing and assets.
- When analytics is configured, verify the intended property receives events.
  When it is absent, the app intentionally sends no analytics request.

## Release and rollback

Merge only after reviewing the preview. Confirm the subsequent production
deployment uses the reviewed commit and repeat the smoke test on the production
domain. Keep the previous successful deployment available for Vercel rollback.
Preserve the old CRA environment variables until the production migration is
verified; old deployments may still need their original configuration.
