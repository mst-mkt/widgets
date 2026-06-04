import { describe, expect, it, vi } from 'vite-plus/test'

vi.mock('ags', () => import('../../test/mocks/ags'))

vi.mock('ags/process', () => import('../../test/mocks/ags-process'))

vi.mock('ags/time', () => import('../../test/mocks/ags-time'))

vi.mock('gi://GLib', () => import('../../test/mocks/gi-glib'))

const { parseBrightness } = await import('./brightness')

describe('parseBrightness', () => {
  it('converts a percentage string to a 0-1 ratio', () => {
    expect(parseBrightness('75')).toBe(0.75)
    expect(parseBrightness('0')).toBe(0)
    expect(parseBrightness('100')).toBe(1)
  })

  it('ignores trailing whitespace from the command output', () => {
    expect(parseBrightness('40\n')).toBe(0.4)
  })

  it('falls back to 0 for non-numeric output', () => {
    expect(parseBrightness('')).toBe(0)
    expect(parseBrightness('n/a')).toBe(0)
  })

  it('clamps values outside the 0-1 range', () => {
    expect(parseBrightness('150')).toBe(1)
    expect(parseBrightness('-5')).toBe(0)
  })
})
