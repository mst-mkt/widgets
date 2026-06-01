import { defineConfig } from 'vite-plus'

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  test: {
    include: ['{utils,services,stores,components,widgets}/**/*.test.{ts,tsx}'],
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
