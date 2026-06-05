import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import {
  goToday,
  nextMonth,
  prevMonth,
  selectDay,
  selectedDate,
  setSelectedDate,
  setViewMonth,
  todayDate,
  viewMonth,
} from './calendar'

vi.mock('ags', () => import('../../test/mocks/ags'))

vi.mock('ags/time', () => import('../../test/mocks/ags-time'))

vi.mock('ags/process', () => import('../../test/mocks/ags-process'))

vi.mock('gi://GLib', () => import('../../test/mocks/gi-glib'))

describe('calendar store', () => {
  beforeEach(() => {
    setViewMonth({ year: 2026, month: 6 })
    setSelectedDate({ year: 2026, month: 6, day: 5 })
  })

  it('derives today from the clock', () => {
    expect(todayDate.peek()).toEqual({ year: 2026, month: 6, day: 1 })
  })

  it('navigates months without touching the selection', () => {
    nextMonth()
    expect(viewMonth.peek()).toEqual({ year: 2026, month: 7 })
    expect(selectedDate.peek()).toEqual({ year: 2026, month: 6, day: 5 })
  })

  it('wraps the year on month steps', () => {
    setViewMonth({ year: 2026, month: 12 })
    nextMonth()
    expect(viewMonth.peek()).toEqual({ year: 2027, month: 1 })
    setViewMonth({ year: 2026, month: 1 })
    prevMonth()
    expect(viewMonth.peek()).toEqual({ year: 2025, month: 12 })
  })

  it('selects the given date', () => {
    selectDay({ year: 2026, month: 7, day: 20 })
    expect(selectedDate.peek()).toEqual({ year: 2026, month: 7, day: 20 })
  })

  it('returns to the current month and today', () => {
    setViewMonth({ year: 2020, month: 1 })
    setSelectedDate({ year: 2020, month: 1, day: 1 })
    goToday()
    expect(viewMonth.peek()).toEqual({ year: 2026, month: 6 })
    expect(selectedDate.peek()).toEqual({ year: 2026, month: 6, day: 1 })
  })
})
