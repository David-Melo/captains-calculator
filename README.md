# Captain of Industry Calculator

[https://captains-calculator.com](https://captains-calculator.com)

Find it hard to plan you factories in the game 'Captain of Industry'?

This is your solution. Captains Calculator lets you plan out parts of your factory and understand the resources needed, inputs outputs and lets you better understand and plan things out.

## Development

Use Node 24 (`nvm use`) and Yarn 1.22.22 (`corepack enable`).

```sh
yarn install --frozen-lockfile
yarn dev
```

`yarn run validate` runs the regression tests, TypeScript checks for the app and Vite config,
and a production build. `yarn build` includes type checking and outputs `dist/`.
Use `yarn test:watch` while developing and `yarn preview` to inspect a production build.
`yarn audit:check` blocks high/critical dependency findings in GitHub CI; see
[the security review](docs/dependency-security.md) for the remaining Router findings.

See [the deployment checklist](docs/deployment.md) before deploying the CRA-to-Vite migration.
