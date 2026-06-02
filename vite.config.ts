import { defineConfig } from 'vite-plus'

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  test: {
    include: ['./src/**/*.test.{ts,tsx}'],
  },
  fmt: {
    semi: false,
    singleQuote: true,
    sortImports: {},
    sortPackageJson: {
      sortScripts: false,
    },
    sortTailwindcss: {
      attributes: ['class'],
      functions: ['unoMerge'],
    },
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
})
