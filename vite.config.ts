import { defineConfig } from 'vite-plus'

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
  fmt: {
    semi: false,
    singleQuote: true,
    sortImports: {},
    sortPackageJson: {
      sortScripts: false,
    },
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
})
