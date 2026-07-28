# Tech Debt Audit — Captain's Calculator

> Audit date: 2026-04-02

---

## Phase 1 — Dead Weight Removal (Quick Wins)

- [x] **Remove `zod`** — installed but never imported anywhere. Yup handles all validation (`src/utils/forms.ts`).
- [ ] **Remove `xstate` + `@xstate/react`** — installed but never imported. Overmind is the sole state manager.
- [ ] **Remove `"install": "^0.13.0"`** from devDependencies — not a real package, likely an accidental `npm install` artifact.
- [ ] **Remove `react-error-overlay` pin** — both the devDependency and the `resolutions` entry exist only as a CRA workaround. Goes away with the Vite migration.
- [ ] **Strip debug `console.log` calls** left in production code:
  - `src/components/calculator/Editor.tsx` — `console.log('onConnect')`
  - `src/components/calculator/RecipeNodeType.tsx` — `console.log(nodeId)`
- [ ] **Resolve `@TODO` in `src/state/recipes/actions/linkRecipe.ts`** (line 32) — incomplete "Create New Node" logic.

---

## Phase 2 — Build System & Core Upgrades (Critical)

### CRA to Vite Migration

- [ ] Replace `react-scripts` with `vite` + `@vitejs/plugin-react`
- [ ] Convert `tsconfig.json` to Vite-compatible config (keep `baseUrl: "./src"` via `vite-tsconfig-paths`)
- [ ] Move `public/index.html` to root `index.html` (Vite convention)
- [ ] Replace `react-scripts start/build/test` scripts with `vite` / `vite build` / `vitest`
- [ ] Remove CRA-specific env var prefix (`REACT_APP_` -> `VITE_`)
- [ ] Extract hardcoded Google Analytics ID (`public/index.html`) into an env variable

### React 17 -> 18+

- [ ] Upgrade `react` and `react-dom` to 18+
- [ ] Replace `ReactDOM.render()` with `createRoot()` in `src/index.tsx`
- [ ] Verify Overmind + Mantine compatibility with React 18 concurrent mode
- [ ] Update `@types/react` and `@types/react-dom` to 18+

### TypeScript 4.4 -> 5.x

- [ ] Upgrade `typescript` to latest 5.x
- [ ] Update `tsconfig.json` target from `es2015` to `es2020` or `esnext` (smaller output, modern features)
- [ ] Audit and fix any new strict-mode errors introduced by TS 5

---

## Phase 3 — Test Coverage (Currently Zero)

The project has testing libraries installed (`@testing-library/react`, `jest-dom`, `user-event`) but **zero test files exist** in `src/`.

- [ ] Set up Vitest (replaces Jest after Vite migration)
- [ ] Add unit tests for `ProductionNode` class (`src/state/recipes/ProductionNode.ts`) — it's the core domain logic
- [ ] Add unit tests for key Overmind actions: `selectRecipe`, `linkRecipe`, `calculateGraph`, `deleteNode`
- [ ] Add integration tests for the Editor flow (select product -> machine -> recipe -> link nodes)
- [ ] Add smoke tests for each route/screen rendering without crashing

---

## Phase 4 — UI Library & Dependency Upgrades (High)

### Mantine v4 -> v7

This is a large migration. Mantine v7 is a near-full rewrite.

- [ ] Replace `createStyles()` with CSS Modules or Mantine's new `classNames` API
- [ ] Replace `sx` prop usage with `style` prop or CSS variables
- [ ] Update all component imports (many were renamed/removed between v4-v7)
- [ ] Replace `@mantine/modals` and `@mantine/notifications` with v7 equivalents
- [ ] Remove Emotion dependency (Mantine v7 dropped CSS-in-JS)

### react-flow-renderer -> @xyflow/react

- [ ] Rename `react-flow-renderer` (deprecated) to `@xyflow/react` (v11+)
- [ ] Update custom node/edge type APIs (`RecipeNodeType.tsx`, `RecipeEdgeType.tsx`)
- [ ] Verify `@tisoap/react-flow-smart-edge` compatibility or find alternative
- [ ] Update Dagre layout integration for new React Flow API

### Other Dependency Upgrades

- [ ] `framer-motion` 3.x -> 11+ (currently pinned to exact `3.10.6` — likely a compat hack)
- [ ] `formik` 2.x — evaluate replacing with `react-hook-form` (lighter, more actively maintained)
- [ ] `yup` 0.x -> 1.x (breaking changes in schema API)
- [ ] `@iconify/react` 3.x -> 4.x
- [ ] `@testing-library/react` 12 -> 16+
- [ ] `dagre` 0.8.5 — check if still maintained, consider `@dagrejs/dagre` or `elkjs` exclusively
- [ ] `dayjs` 1.10 -> 1.11+ (minor)

---

## Phase 5 — Architecture & Code Quality (Medium)

### Type Safety

- [ ] Eliminate `any` usage — 66 instances across the codebase
  - Priority: `src/state/recipes/state.ts` (lines 24, 29) — `Node<any>[]` and `Edge<any>[]` should use proper generics
  - Audit `src/components/forms/FieldRenderer.tsx` for loose typing

### State Management Patterns

- [ ] Replace `get currentItem()` getters with Overmind `derived()` — plain getters are not reactive in Overmind, components may miss updates
- [ ] Add error handling to `loadJsonData` and `loadSettings` actions — currently no error recovery if JSON loading fails
- [ ] Evaluate Overmind's long-term viability — it's maintained but niche. Zustand or Jotai are lighter alternatives if a rewrite happens

### Styling Consolidation

- [ ] Pick one styling approach and migrate everything to it. Currently three systems coexist:
  - SASS files (`src/theme/scss/`) — 144 lines of global styles + loader + typography
  - Mantine CSS-in-JS (`createStyles()`, `sx` prop) — used in ~6 components
  - Inline React styles — scattered throughout
- [ ] Post-Mantine v7 migration, CSS Modules or vanilla-extract would unify this

### Error Handling

- [ ] Add a React Error Boundary wrapping the app — currently a single component crash kills the whole app
- [ ] Add error states for data loading failures (products/recipes/machines JSON)

---

## Phase 6 — Performance & Bundle Optimization (Medium)

### Code Splitting

- [ ] Convert static JSON imports in `src/state/app/effects/loadJsonData.ts` to dynamic `import()` — all game data (products, recipes, machines, categories, mines, storages) is bundled in the initial chunk
- [ ] Lazy-load route screens with `React.lazy()` + `Suspense`
- [ ] Consider moving game data to a separate fetched JSON endpoint (decouples data updates from code deploys)

### React Performance

- [ ] Add `React.memo`, `useCallback`, `useMemo` where needed — only 7 instances across 126 TS files
  - Priority: `Editor.tsx`, `RecipeNodeType.tsx`, `ResultsSummary.tsx` (re-render on every graph change)
- [ ] Profile the React Flow graph with large production chains — Dagre layout recalculates on every node change

### Bundle Analysis

- [ ] Run `vite-bundle-analyzer` post-migration to identify large chunks
- [ ] Tree-shake unused Mantine components (CRA can't do this well)

---

## Phase 7 — Accessibility (Medium-Low)

- [ ] Add `aria-label` to icon-only buttons (especially navigation in `AppShellLayout.tsx`)
- [ ] Verify color contrast ratios for both light and dark themes
- [ ] Test keyboard navigation through the React Flow graph editor
- [ ] Add meaningful alt text or `role="img"` + `aria-label` to background images in `Editor.tsx`
- [ ] Audit Mantine component usage for missing ARIA attributes (only 18 ARIA instances found across codebase)

---

## Notes

- The `captain-of-data/` git submodule is the source of truth for game data. Any data schema changes there ripple through the branded types (`ProductId`, `RecipeId`, etc.) — keep that coupling in mind during upgrades.
- The branded-type pattern (`type MachineId = keyof typeof machineData`) is clever for type safety but **blocks lazy-loading** since the JSON must be statically imported for TypeScript to extract keys. A migration to runtime validation (Zod schemas, ironically) would decouple types from imports.
- Overmind's `derived()` memoization is doing heavy lifting — the `nodesData` and `edgesData` derivations avoid redundant React Flow re-renders. Don't lose this during any state management migration.
