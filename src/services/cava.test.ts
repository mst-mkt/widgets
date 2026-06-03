import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import { emit, Input, instance, reset, setValues } from '../../test/mocks/gi-cava'

vi.mock('ags', () => import('../../test/mocks/ags'))

vi.mock('gi://AstalCava', () => import('../../test/mocks/gi-cava'))

const panel = vi.hoisted(() => {
  const listeners = new Set<() => void>()
  let value = false

  return {
    accessor: {
      peek: () => value,
      subscribe: (cb: () => void) => {
        listeners.add(cb)
        return () => listeners.delete(cb)
      },
    },
    set: (next: boolean) => {
      value = next
      for (const cb of listeners) cb()
    },
    reset: () => {
      value = false
      listeners.clear()
    },
  }
})

vi.mock('../stores/panel', () => ({ isPanelOpen: () => panel.accessor }))

const { initCava, bars, setBars, BAR_COUNT } = await import('./cava')

const cava = instance()

describe('initCava', () => {
  beforeEach(() => {
    reset()
    panel.reset()
    setBars([])
  })

  it('configures the bar count', () => {
    initCava()

    expect(cava.bars).toBe(BAR_COUNT)
  })

  it('captures the pulse monitor input', () => {
    initCava()

    expect(cava.input).toBe(Input.PULSE)
  })

  it('activates cava only while the player panel is open', () => {
    initCava()
    expect(cava.active).toBe(false)

    panel.set(true)
    expect(cava.active).toBe(true)

    panel.set(false)
    expect(cava.active).toBe(false)
  })

  it('syncs the cava values into the bars state on notify::values', () => {
    initCava()
    panel.set(true)

    setValues([0, 0.5, 1])
    emit('notify::values')

    expect(bars.peek()).toEqual([0, 0.5, 1])
  })

  it('clears the bars when the panel closes', () => {
    initCava()
    panel.set(true)
    setValues([1, 1])
    emit('notify::values')
    expect(bars.peek()).toEqual([1, 1])

    panel.set(false)

    expect(bars.peek()).toEqual([])
  })
})
