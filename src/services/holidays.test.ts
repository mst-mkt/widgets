import { describe, expect, it } from 'vite-plus/test'

import { holidayKeys } from './holidays'

describe('holidayKeys', () => {
  it('returns the public-holiday days of a month as a key set', () => {
    const days = holidayKeys({ year: 2026, month: 5 })
    expect(days.has('2026-5-3')).toBe(true)
    expect(days.has('2026-5-4')).toBe(true)
    expect(days.has('2026-5-5')).toBe(true)
  })

  it('excludes non-holiday observances like Mother’s Day', () => {
    expect(holidayKeys({ year: 2026, month: 5 }).has('2026-5-10')).toBe(false)
  })

  it('is empty for a month with no public holidays', () => {
    expect(holidayKeys({ year: 2026, month: 6 }).size).toBe(0)
  })
})
