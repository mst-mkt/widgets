import { defineConfig } from 'vite-plus'

export default defineConfig({
  run: {
    tasks: {
      dev: {
        command: "pnpm run '/^watch:.*/'",
      },
      'watch:ags': {
        command: 'watchexec -r -e ts,tsx,css -- ags run app.ts',
      },
      'watch:css': {
        command: "unocss '**/*.tsx' -o style.css --watch",
      },
      'gen:css': {
        command: "unocss '**/*.tsx' -o style.css",
      },
    },
  },
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
