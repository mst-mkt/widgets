import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import { emit, Input, instance, reset as resetCava, setValues } from '../../test/mocks/gi-cava'

vi.mock('ags', () => import('../../test/mocks/ags'))

vi.mock('ags/process', () => import('../../test/mocks/ags-process'))

vi.mock('gi://AstalCava', () => import('../../test/mocks/gi-cava'))

const { bars, BAR_COUNT } = await import('./cava')
const { openPanel, closePanel } = await import('../stores/panel')

const cava = instance()

const noop = () => {}

beforeEach(() => {
  resetCava()
  closePanel()
})

let dispose = noop

const start = () => {
  dispose = bars.subscribe(noop)
}

afterEach(() => {
  dispose()
  dispose = noop
})

describe('cava', () => {
  it('configures the bar count', () => {
    start()

    expect(cava.bars).toBe(BAR_COUNT)
  })

  it('captures the pulse monitor input', () => {
    start()

    expect(cava.input).toBe(Input.PULSE)
  })

  it('activates cava only while the player panel is open', () => {
    start()
    expect(cava.active).toBe(false)

    openPanel('player')
    expect(cava.active).toBe(true)

    closePanel()
    expect(cava.active).toBe(false)
  })

  it('syncs the cava values into the bars state on notify::values', () => {
    start()
    openPanel('player')

    setValues([0, 0.5, 1])
    emit('notify::values')

    expect(bars.peek()).toEqual([0, 0.5, 1])
  })

  it('clears the bars when the panel closes', () => {
    start()
    openPanel('player')
    setValues([1, 1])
    emit('notify::values')
    expect(bars.peek()).toEqual([1, 1])

    closePanel()

    expect(bars.peek()).toEqual([])
  })
})
