import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import { clock, resetGLib, timers } from '../mocks/gi-glib'

vi.mock('gi://GLib', () => import('../mocks/gi-glib'))
vi.mock('ags', () => import('../mocks/ags'))

const { createState } = await import('ags')
const { tweened } = await import('./tweened')

const atMs = (ms: number) => {
  clock.us = ms * 1000
}

const runTimer = () => {
  const tick = timers[0]
  if (!tick) throw new Error('no timer scheduled')
  return tick()
}

describe('tweened', () => {
  beforeEach(() => {
    resetGLib()
  })

  it('starts at the source value and schedules nothing until it changes', () => {
    const [source] = createState(0)

    const value = tweened(source, { duration: 1000, easing: (t) => t })

    expect(value.peek()).toBe(0)
    expect(timers).toHaveLength(0)
  })

  it('interpolates toward the new target over the duration', () => {
    const [source, setSource] = createState(0)
    const value = tweened(source, { duration: 1000, easing: (t) => t })

    setSource(1)

    expect(timers).toHaveLength(1)

    atMs(250)
    runTimer()

    expect(value.peek()).toBeCloseTo(0.25)

    atMs(1000)

    expect(runTimer()).toBe(false)
    expect(value.peek()).toBe(1)
  })

  it('ignores re-emits of the same value', () => {
    const [source, setSource] = createState(5)
    tweened(source, { duration: 1000, easing: (t) => t })

    setSource(5)

    expect(timers).toHaveLength(0)
  })

  it('re-targets mid-flight from the current value without a second timer', () => {
    const [source, setSource] = createState(0)
    const value = tweened(source, { duration: 1000, easing: (t) => t })

    setSource(1)
    atMs(500)
    runTimer()

    expect(value.peek()).toBeCloseTo(0.5)

    setSource(0)

    expect(timers).toHaveLength(1)

    atMs(1000)
    runTimer()

    expect(value.peek()).toBeCloseTo(0.25)
  })
})
