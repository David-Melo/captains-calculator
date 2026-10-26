import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

// Match the app's src/ baseUrl. The Framer Motion paths entry in tsconfig is
// declaration-only: Vite must load that package's JavaScript entry normally.
const sourceDirectories = ['components', 'state', 'theme', 'data', 'routes', 'screens', 'utils']

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: Object.fromEntries(sourceDirectories.map(name => [
      name, fileURLToPath(new URL(`./src/${name}`, import.meta.url)),
    ])),
  },
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
})
