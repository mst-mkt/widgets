import { presetGtk } from '@itt/unocss-preset-gtk'
import { defineConfig } from 'unocss'

const colors = {
  surface: 'rgba(20, 20, 24, 0.92)',
} as const satisfies Record<string, string>

export default defineConfig({
  presets: [presetGtk()],
  theme: { colors, spacing: {}, fontSize: {} },
  rules: [[/^shadow-none$/, () => ({ 'box-shadow': 'none' })]],
})
