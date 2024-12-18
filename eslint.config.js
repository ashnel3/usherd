import globals from 'globals'
import js from '@eslint/js'
import ts from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier/recommended'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['**/dist', '**/profile', '**/node_modules'],
    files: ['**/*.{js,mjs,cjs,ts}'],
  },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...prettier,
  {
    rules: {
      'prettier/prettier': 1,
    },
  },
]
