import { describe, expect, it, vi } from 'vite-plus/test'

import { todayDate, viewMonth } from './calendar'

vi.mock('ags', () => import('../../test/mocks/ags'))

vi.mock('ags/time', () => import('../../test/mocks/ags-time'))

vi.mock('gi://GLib', () => import('../../test/mocks/gi-glib'))

describe('calendar store', () => {
  it('starts on the current month', () => {
    expect(viewMonth.peek()).toEqual({ year: 2026, month: 6 })
  })

  it('derives today from the clock', () => {
    expect(todayDate.peek()).toEqual({ year: 2026, month: 6, day: 1 })
  })
})
