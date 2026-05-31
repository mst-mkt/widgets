import { describe, expect, it } from 'vite-plus/test'

import { easeOutCubic, lerp } from './math'

describe('lerp', () => {
  it('returns the endpoints at t=0 and t=1', () => {
    expect(lerp(0, 10, 0)).toBe(0)
    expect(lerp(0, 10, 1)).toBe(10)
  })

  it('interpolates linearly', () => {
    expect(lerp(0, 10, 0.5)).toBe(5)
    expect(lerp(8, 24, 0.5)).toBe(16)
  })
})

describe('easeOutCubic', () => {
  it('is pinned at 0 and 1', () => {
    expect(easeOutCubic(0)).toBe(0)
    expect(easeOutCubic(1)).toBe(1)
  })

  it('eases out (past the midpoint at t=0.5)', () => {
    expect(easeOutCubic(0.5)).toBeCloseTo(0.875)
  })
})
