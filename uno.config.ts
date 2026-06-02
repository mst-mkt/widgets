import { presetGtk } from '@itt/unocss-preset-gtk'
import { defineConfig } from 'unocss'

const colors = {
  surface: 'rgba(20, 20, 24, 0.92)',
  card: 'rgba(255, 255, 255, 0.05)',
  elevated: 'rgba(255, 255, 255, 0.08)',
  gold: 'rgba(248, 199, 6, 1)',
  ink: 'rgba(255, 255, 255, 0.92)',
  dim: 'rgba(255, 255, 255, 0.70)',
  mute: 'rgba(255, 255, 255, 0.55)',
  faint: 'rgba(255, 255, 255, 0.40)',
  ghost: 'rgba(255, 255, 255, 0.20)',
} as const satisfies Record<string, string>

export default defineConfig({
  presets: [presetGtk()],
  theme: { colors, spacing: {}, fontSize: {} },
  rules: [
    [/^shadow-none$/, () => ({ 'box-shadow': 'none' })],
    [/^font-icon$/, () => ({ 'font-family': '"lucide"' })],
    [
      /^font-(light|normal|medium|semibold|bold)$/,
      ([, weight = 'normal']) => ({
        'font-weight':
          { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700 }[weight] ?? 400,
      }),
    ],
    [/^text-(\d+)$/, ([, size = '0']) => ({ 'font-size': `${size}px` })],
    [/^transition$/, () => ({ transition: 'background-color 150ms ease' })],
  ],
  preflights: [
    {
      getCSS: () => {
        return 'scrolledwindow undershoot, scrolledwindow overshoot { background: none; box-shadow: none; }'
      },
    },
  ],
})
