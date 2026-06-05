import { describe, expect, it } from 'vite-plus/test'

import { formatClock } from './format'

describe('formatClock', () => {
  it('formats a dot-separated, zero-padded date and time with the year', () => {
    expect(formatClock({ year: 2026, month: 6, day: 5, hour: 9, minute: 5, second: 3 })).toBe(
      '2026.06.05 09:05:03',
    )
  })
})
