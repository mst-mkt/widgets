import { describe, expect, it } from 'vite-plus/test'

import { daysInMonth, isSameDay, monthMatrix, weekdayOf } from './calendar'

describe('daysInMonth', () => {
  it('returns the day count per month', () => {
    expect(daysInMonth(2026, 6)).toBe(30)
    expect(daysInMonth(2026, 2)).toBe(28)
    expect(daysInMonth(2024, 2)).toBe(29)
  })
})

describe('weekdayOf', () => {
  it('returns the 0=Sunday weekday', () => {
    expect(weekdayOf({ year: 2026, month: 6, day: 5 })).toBe(5)
    expect(weekdayOf({ year: 2026, month: 6, day: 7 })).toBe(0)
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

describe('monthMatrix', () => {
  it('returns weeks of seven cells starting on Sunday', () => {
    const weeks = monthMatrix(2026, 6)

    expect(weeks.every((week) => week.length === 7)).toBe(true)
    expect(weeks[0]?.[0]).toBe(null)
    expect(weeks[0]?.[1]).toEqual({ year: 2026, month: 6, day: 1 })
    expect(weeks.flat().filter((cell) => cell !== null)).toHaveLength(30)
  })
})
