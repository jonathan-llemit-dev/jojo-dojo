import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // `.kilo` holds editor agent worktrees — full copies of this project, each with its
  // own tsconfig. Linting them makes typescript-eslint see two candidate
  // tsconfigRootDirs and fail to parse EVERY file in both trees, so `npm run lint`
  // reported 44 parsing errors that had nothing to do with this code.
  globalIgnores(['dist', '.kilo']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
])
