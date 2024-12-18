// https://vite.dev/config

import { defineConfig } from 'vitest/config'
import type { IUsherEnvironment } from './src/app'

// plugins

import dts from 'vite-plugin-dts'
import externals from 'rollup-plugin-node-externals'
import tsPaths from 'vite-tsconfig-paths'

// config

/**
 * create usher global defines
 * @param env   - process env
 * @returns     - vite global defines
 */
export const defines = ({
  npm_package_name: NAME = 'usher',
  npm_package_homepage: HOMEPAGE = '',
  npm_package_bugs: ISSUES = '',
  npm_package_description: DESCRIPTION = '',
  npm_package_version: VERSION = '0.0.0',
}: NodeJS.ProcessEnv): IUsherEnvironment => {
  return {
    USHERD: {
      DESCRIPTION,
      HOMEPAGE,
      ISSUES,
      NAME,
      VERSION,
      PATH: {
        CONFIG: '.usherd.json',
        DATABASE: '.usherd.db',
      },
    },
  }
}

/** vite configuration */
export default defineConfig({
  build: {
    lib: {
      entry: {
        bin: './src/bin',
        index: './src/lib',
      },
      formats: ['cjs', 'es'],
    },
  },
  define: defines(process.env),
  plugins: [
    dts({ copyDtsFiles: true, insertTypesEntry: true }),
    externals({ builtinsPrefix: 'add' }),
    tsPaths(),
  ] as any,
  test: {
    environment: 'node',
    include: ['./src/test/*.test.ts'],
  },
})
