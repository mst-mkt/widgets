import { describe, expect, it } from 'vite-plus/test'

import { formatClock, formatDate, formatYearMonth, formatYearMonthDay } from './format'

describe('formatDate', () => {
  it('formats month, day and the Japanese weekday', () => {
    expect(formatDate({ month: 6, day: 1, weekday: 2 })).toBe('6月1日 (火)')
  })

  it('leaves the weekday blank when out of range', () => {
    expect(formatDate({ month: 6, day: 1, weekday: 0 })).toBe('6月1日 ()')
  })
})

describe('formatClock', () => {
  it('formats a dot-separated, zero-padded date and time with the year', () => {
    expect(formatClock({ year: 2026, month: 6, day: 5, hour: 9, minute: 5, second: 3 })).toBe(
      '2026.06.05 09:05:03',
    )
  })
})

describe('formatYearMonth', () => {
  it('formats year and month', () => {
    expect(formatYearMonth({ year: 2026, month: 6 })).toBe('2026年6月')
  })
})

describe('formatYearMonthDay', () => {
  it('formats year, month and day', () => {
    expect(formatYearMonthDay({ year: 2026, month: 6, day: 5 })).toBe('2026年6月5日')
  })
})
