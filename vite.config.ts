import { defineConfig } from 'vite-plus'

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  test: {
    include: ['{utils,services,components,widgets}/**/*.test.{ts,tsx}'],
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
