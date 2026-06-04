import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import { resetTime, timers } from '../../test/mocks/ags-time'
import { formatDate, initClock, secondsUntilMidnight, setToday, today, weekdayLabel } from './clock'

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

describe('secondsUntilMidnight', () => {
  it('counts the seconds left in the day', () => {
    expect(secondsUntilMidnight({ hour: 0, minute: 0, second: 0 })).toBe(86400)
    expect(secondsUntilMidnight({ hour: 23, minute: 59, second: 59 })).toBe(1)
  })
})

describe('initClock', () => {
  beforeEach(resetTime)

  it('sets today and schedules a midnight tick', () => {
    setToday('stale')

    initClock()

    expect(today.peek()).toBe('6月1日 (火)')
    expect(timers).toHaveLength(1)
  })

  it('reschedules itself for the next midnight when the tick fires', () => {
    initClock()

    timers[0]?.()

    expect(timers).toHaveLength(2)
  })
})
