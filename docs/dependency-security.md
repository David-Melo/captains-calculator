# Dependency security review

Run `yarn audit:check` against the committed lockfile when reviewing dependency
changes. Advisory counts can include multiple paths to the same package; they
do not by themselves establish whether the deployed application is exploitable.
The GitHub validation job fails on high/critical findings or an incomplete audit.
Moderate findings still require review; the two known Router advisories below
are not silently treated as patched. `yarn audit --json` provides the full report.

## React Router 6 advisories

React Router is kept on the React-17-compatible v6 line for this migration. Moving
to React Router 7 also requires a React upgrade and a separate compatibility review.
The v6 redirect/XSS fix in 6.30.6 is included, but two broader advisories remain:

- [GHSA-337j-9hxr-rhxg](https://github.com/remix-run/react-router/security/advisories/GHSA-337j-9hxr-rhxg)
  concerns SSR hydration. The upstream advisory explicitly excludes Declarative
  Mode. This calculator uses `BrowserRouter` with client rendering; it has no SSR
  or hydration path.
- [GHSA-wrjc-x8rr-h8h6](https://github.com/remix-run/react-router/security/advisories/GHSA-wrjc-x8rr-h8h6)
  concerns attacker-controlled navigation paths. The active calculator routes use
  application-defined navigation; no URL-query, API, or form-provided redirect
  target was identified in that active route tree. This is an applicability review,
  not a claim that the dependency is patched. Never pass an untrusted URL directly
  to `Link`, `Navigate`, or `navigate`; re-review before enabling additional routes.

The upstream fixes for these advisories start at React Router 7.18.0. Keep these
findings visible until the application is migrated to a compatible patched release.

## Tooling and deployment

Vite and Vitest are build/development tools. Vercel publishes the static `dist/`
directory; it must not run `vite` or `vite preview` as a public production server.
The lockfile's Vite resolution keeps Vitest and the build on the same compatible,
patched Vite 7 line and avoids a Yarn Classic peer-linking failure with mixed majors.
Additional resolutions keep the previously vulnerable transitive packages on
compatible patched major versions. Update the lockfile and rerun the checks when
changing these minimums.

The existing Framer Motion runtime is unchanged. Its declaration-only TypeScript
path mapping works around the old package's incomplete exports; Vite uses native
src-directory aliases and still bundles the package's JavaScript entry normally.
Unused Ajv was removed, eliminating its vulnerable `fast-uri` dependency chain.

The build performs real type checks rather than bypassing diagnostics with CRA's
`TSC_COMPILE_ON_ERROR`. GitHub Actions uses commit-pinned actions and read-only
repository permissions; it does not receive deployment or application secrets.
