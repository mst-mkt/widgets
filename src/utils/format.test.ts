import { describe, expect, it } from 'vite-plus/test'

import {
  formatClock,
  formatDate,
  formatEventTime,
  formatMonthDayWeekday,
  formatYearMonth,
} from './format'

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

describe('formatMonthDayWeekday', () => {
  it('formats month, day and the derived Japanese weekday', () => {
    expect(formatMonthDayWeekday({ year: 2026, month: 6, day: 5 })).toBe('6月5日 (金)')
    expect(formatMonthDayWeekday({ year: 2026, month: 6, day: 7 })).toBe('6月7日 (日)')
  })
})

describe('formatEventTime', () => {
  it('shows the start time for a timed event', () => {
    expect(formatEventTime({ allDay: false, start: '2026-06-05T09:30:00+09:00' })).toBe('09:30')
  })

  it('labels an all-day event', () => {
    expect(formatEventTime({ allDay: true, start: '2026-06-05' })).toBe('終日')
  })
})
