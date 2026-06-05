import { presetGtk } from '@itt/unocss-preset-gtk'
import { defineConfig } from 'unocss'

const colors = {
  surface: 'rgba(20, 20, 24, 0.8)',
  card: 'rgba(255, 255, 255, 0.05)',
  elevated: 'rgba(255, 255, 255, 0.08)',
  gold: 'rgba(248, 199, 6, 1)',
  coal: 'rgba(20, 20, 24, 1)',
  weekend: 'rgba(196, 160, 56, 0.9)',
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
    [/^font-mono$/, () => ({ 'font-family': '"UDEV Gothic NF", monospace' })],
    [/^tracking-\[(.+)\]$/, ([, value = '0']) => ({ 'letter-spacing': value })],
    [
      /^font-(light|normal|medium|semibold|bold)$/,
      ([, weight = 'normal']) => ({
        'font-weight':
          { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700 }[weight] ?? 400,
      }),
    ],
    [/^text-(\d+)$/, ([, size = '0']) => ({ 'font-size': `${size}px` })],
    [
      /^transition(?:-(\d+))?$/,
      ([, ms = '150']) => ({ transition: `min-width ${ms}ms ease, background-color ${ms}ms ease` }),
    ],
  ],
  preflights: [
    {
      getCSS: () => {
        return 'scrolledwindow undershoot, scrolledwindow overshoot { background: none; box-shadow: none; }'
      },
    },
    {
      getCSS: () => {
        return 'entry.launcher-entry, entry.launcher-entry:focus, entry.launcher-entry:focus-within, entry.launcher-entry > text { background-color: transparent; background-image: none; border-width: 0; outline-width: 0; box-shadow: none; }'
      },
    },
  ],
})
