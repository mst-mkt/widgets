import { describe, expect, it } from 'vite-plus/test'

import {
  addMonths,
  dayKey,
  isSameDay,
  isSameMonth,
  isoWeekdayOf,
  monthMatrix,
  weekdayOf,
} from './calendar'

describe('weekdayOf', () => {
  it('returns the 0=Sunday weekday', () => {
    expect(weekdayOf({ year: 2026, month: 6, day: 5 })).toBe(5)
    expect(weekdayOf({ year: 2026, month: 6, day: 7 })).toBe(0)
  })
})

describe('isoWeekdayOf', () => {
  it('maps to ISO weekday (Mon=1..Sun=7)', () => {
    expect(isoWeekdayOf({ year: 2026, month: 6, day: 1 })).toBe(1)
    expect(isoWeekdayOf({ year: 2026, month: 6, day: 5 })).toBe(5)
    expect(isoWeekdayOf({ year: 2026, month: 6, day: 7 })).toBe(7)
  })
})

describe('isSameDay', () => {
  it('compares the full date', () => {
    expect(isSameDay({ year: 2026, month: 6, day: 5 }, { year: 2026, month: 6, day: 5 })).toBe(true)
    expect(isSameDay({ year: 2026, month: 6, day: 5 }, { year: 2026, month: 6, day: 6 })).toBe(
      false,
    )
  })
})

describe('dayKey', () => {
  it('builds a year-month-day key', () => {
    expect(dayKey({ year: 2026, month: 6, day: 5 })).toBe('2026-6-5')
  })
})

describe('isSameMonth', () => {
  it('matches a date against a year and month', () => {
    expect(isSameMonth({ year: 2026, month: 6, day: 30 }, { year: 2026, month: 6 })).toBe(true)
    expect(isSameMonth({ year: 2026, month: 7, day: 1 }, { year: 2026, month: 6 })).toBe(false)
  })
})

describe('addMonths', () => {
  it('advances within a year', () => {
    expect(addMonths({ year: 2026, month: 6 }, 1)).toEqual({ year: 2026, month: 7 })
  })

  it('wraps the year in both directions', () => {
    expect(addMonths({ year: 2026, month: 12 }, 1)).toEqual({ year: 2027, month: 1 })
    expect(addMonths({ year: 2026, month: 1 }, -1)).toEqual({ year: 2025, month: 12 })
  })
})

describe('monthMatrix', () => {
  it('keeps a constant six-week height', () => {
    expect(monthMatrix(2026, 6)).toHaveLength(6)
    expect(monthMatrix(2026, 2)).toHaveLength(6)
    expect(monthMatrix(2026, 11)).toHaveLength(6)
    expect(monthMatrix(2026, 6).every((week) => week.length === 7)).toBe(true)
  })

  it('adds a leading previous-month week only for Sunday-starting months', () => {
    const weeks = monthMatrix(2026, 11)

    expect(weeks[0]?.[0]).toEqual({ year: 2026, month: 10, day: 25 })
    expect(weeks[1]?.[0]).toEqual({ year: 2026, month: 11, day: 1 })
    expect(weeks.at(-1)?.some((day) => day.month === 12)).toBe(true)
  })

  it('leaves non-Sunday months unshifted', () => {
    const weeks = monthMatrix(2026, 6)

    expect(weeks[0]?.[0]).toEqual({ year: 2026, month: 5, day: 31 })
    expect(weeks[0]?.[1]).toEqual({ year: 2026, month: 6, day: 1 })
    expect(weeks.flat().filter((day) => day.month === 6)).toHaveLength(30)
    expect(weeks.flat().at(-1)?.month).toBe(7)
  })
})
