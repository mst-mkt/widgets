import { presetGtk } from '@itt/unocss-preset-gtk'
import { defineConfig } from 'unocss'

const colors = {
  surface: 'rgba(20, 20, 24, 0.92)',
  elevated: 'rgba(255, 255, 255, 0.08)',
  gold: 'rgba(248, 199, 6, 1)',
  mute: 'rgba(255, 255, 255, 0.55)',
} as const satisfies Record<string, string>

export default defineConfig({
  presets: [presetGtk()],
  theme: { colors, spacing: {}, fontSize: {} },
  rules: [
    [/^shadow-none$/, () => ({ 'box-shadow': 'none' })],
    [/^font-icon$/, () => ({ 'font-family': '"lucide"' })],
  ],
})
