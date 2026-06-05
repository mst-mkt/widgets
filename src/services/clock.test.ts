import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import { resetTime, timers } from '../../test/mocks/ags-time'
import { formatDate, initClock, setTime, time, today, weekdayLabel } from './clock'

vi.mock('ags', () => import('../../test/mocks/ags'))

vi.mock('ags/time', () => import('../../test/mocks/ags-time'))

vi.mock('gi://GLib', () => import('../../test/mocks/gi-glib'))

describe('weekdayLabel', () => {
  it('maps ISO weekdays 1-7 to Japanese labels', () => {
    expect([1, 2, 3, 4, 5, 6, 7].map(weekdayLabel)).toEqual([
      '月',
      '火',
      '水',
      '木',
      '金',
      '土',
      '日',
    ])
  })

  it('is empty out of range', () => {
    expect(weekdayLabel(0)).toBe('')
    expect(weekdayLabel(8)).toBe('')
  })
})

describe('formatDate', () => {
  it('formats month, day and weekday', () => {
    expect(formatDate({ month: 6, day: 1, weekday: 2 })).toBe('6月1日 (火)')
  })
})

describe('initClock', () => {
  beforeEach(resetTime)

  it('sets today and the current time, then schedules a one-second tick', () => {
    setTime({ year: 0, month: 0, day: 0, hour: 0, minute: 0, second: 0 })

    initClock()

    expect(time.peek()).toEqual({ year: 2026, month: 6, day: 1, hour: 12, minute: 0, second: 0 })
    expect(today.peek()).toBe('6月1日 (火)')
    expect(timers).toHaveLength(1)
  })

  it('reschedules itself every second when the tick fires', () => {
    initClock()

    timers[0]?.()

    expect(timers).toHaveLength(2)
  })
})
