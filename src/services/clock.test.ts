import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import { resetTime, timers } from '../../test/mocks/ags-time'
import { initClock, setTime, time, today } from './clock'

vi.mock('ags', () => import('../../test/mocks/ags'))

vi.mock('ags/time', () => import('../../test/mocks/ags-time'))

vi.mock('gi://GLib', () => import('../../test/mocks/gi-glib'))

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
