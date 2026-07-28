# Captain's Calculator

## What Is This

A web-based factory planner for the game **Captain of Industry**. Users compose production chains by selecting products, machines, and recipes, then visually link them in an interactive node graph. The app calculates total resource requirements (workers, electricity, maintenance, computing, unity) and aggregate input/output flows in real time.

Live at: https://captains-calculator.com

## Tech Stack

| Layer              | Technology                                                    |
|--------------------|---------------------------------------------------------------|
| Framework          | React 17 + TypeScript 4.4 (CRA / react-scripts 4.0.3)       |
| State Management   | Overmind (centralized, derived state, effects)                |
| Graph / Flow       | react-flow-renderer 10.x, Dagre (auto-layout), elkjs         |
| UI Library         | Mantine v4 (core, hooks, modals, notifications, dates)       |
| Styling            | SASS + Mantine CSS-in-JS (Emotion), custom Euclid Circular B font |
| Forms              | Formik + Yup                                                 |
| Animations         | Framer Motion 3.x                                            |
| Routing            | React Router v6                                              |
| Icons              | @iconify/react                                               |
| Edge Rendering     | @tisoap/react-flow-smart-edge                                |
| Persistence        | localStorage (settings/theme)                                |

## Project Structure

```
src/
  components/         # Reusable UI organized by feature domain
    calculator/       # Core editor: Editor, SetupBar, ResultsSummary, RecipeNodeType, drawers
    forms/            # Generic form components (FieldRenderer, FormDrawer)
    layout/           # AppShell, page layouts
    navigation/       # Nav context, breadcrumbs
    products/         # Product-specific UI
    recipes/          # Recipe-specific UI
    ui/               # Shared primitives (cards, badges, icons)
  screens/            # Full-page route views (Calculator, Home, Products, Buildings, Recipes)
  state/              # Overmind store — modular by domain
    app/              # Root state: settings, loading, theme toggle, data loading
    machines/         # Machine/building entities
    products/         # Product entities
    categories/       # Machine category entities
    recipes/          # Recipe entities + production nodes/edges/graph logic
  routes/             # Route definitions (Guest.tsx)
  theme/              # Mantine theme config, SCSS, fonts
  data/               # JSON data (imported from captain-of-data submodule)
  utils/              # Shared helpers

captain-of-data/      # Git submodule — game data extraction
  calculator/data/    # products.json, recipes.json, machines.json, categories.json
```

## Architecture

### State Management (Overmind)

Four namespaced modules, each following the same pattern:

```
module/
  state.ts     # items dict + derived lists (itemsList, currentItem)
  actions.ts   # action handlers
  effects.ts   # side effects (data loading, localStorage)
  _types.ts    # module-specific types
```

Key modules: `app`, `machines`, `products`, `categories`, `recipes`.

The `recipes` module is the most complex — it owns the `nodes` dictionary (runtime `ProductionNode` instances), plus derived `nodesData` and `edgesData` arrays that feed directly into React Flow.

### Data Flow

1. **Init** — `onInitializeOvermind` loads JSON from `captain-of-data/` submodule via effects, populates all entity stores, loads localStorage settings.
2. **User builds a chain** — selects Product -> Machine -> Recipe via drawer components. `selectRecipe` action creates a `ProductionNode`, resolves input sources and output targets.
3. **Linking** — `linkRecipe` / `linkExistingRecipe` connects nodes, creating imports/exports between them and edges for the graph.
4. **Layout** — Dagre computes LR (left-to-right) positions. React Flow renders custom `RecipeNodeType` nodes and `RecipeEdgeType` edges.
5. **Results** — `ResultsSummary` aggregates across all nodes: workers, electricity, maintenance I/II, computing, unity, building counts, product I/O totals.

### Key Class: `ProductionNode`

Located at `src/state/recipes/ProductionNode.ts`. Encapsulates a single production step: recipe, machine, category, typed inputs/outputs with import/export tracking, `machinesCount`, `duration`. Exposes `nodeData` and `edgeData` getters for React Flow consumption.

## Commands

```bash
npm start    # Dev server (CRA)
npm run build   # Production build
npm test     # Jest + React Testing Library
```

## Conventions

- **TypeScript strict mode** — `tsconfig.json` has `"strict": true`, baseUrl `"./src"` for clean imports.
- **Derived state over computed-on-render** — Overmind `derived()` memoizes lists and graph data at the state layer, not inside components.
- **Entity IDs are type-branded** — `ProductId`, `RecipeId`, `MachineId`, `CategoryId` are `keyof typeof data`, giving compile-time safety against invalid lookups.
- **Three-panel layout** — Calculator screen uses a persistent `EditorLayout`: left setup bar, center flow editor, right results summary.
- **Dark/light mode** — toggled via Mantine's `ColorSchemeProvider`, persisted to localStorage.
- **Git submodule** — `captain-of-data/` is an external repo containing extracted game data. Update it with `git submodule update --remote`.
