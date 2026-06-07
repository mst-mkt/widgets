import { describe, expect, it } from 'vite-plus/test'

import { DEFAULT_HEIGHT, depthOf, GAP, heightOf, PEEK, stackHeight, stackOffset } from './toast'

const sizes = (entries: [number, number][]) => new Map(entries)

describe('heightOf', () => {
  it('returns the measured height or the default', () => {
    expect(heightOf(sizes([[1, 90]]), 1)).toBe(90)
    expect(heightOf(sizes([]), 1)).toBe(DEFAULT_HEIGHT)
  })
})

describe('depthOf', () => {
  it('measures distance from the front (last id), 0 for the newest', () => {
    expect(depthOf([1, 2, 3], 3)).toBe(0)
    expect(depthOf([1, 2, 3], 2)).toBe(1)
    expect(depthOf([1, 2, 3], 1)).toBe(2)
    expect(depthOf([1, 2, 3], 9)).toBe(0)
  })
})

describe('stackOffset', () => {
  const ids = [1, 2, 3]
  const heights = sizes([
    [1, 80],
    [2, 70],
    [3, 60],
  ])

  it('keeps the front toast at the bottom in both states', () => {
    expect(stackOffset(ids, heights, 3, 0)).toBeCloseTo(0)
    expect(stackOffset(ids, heights, 3, 1)).toBeCloseTo(0)
  })

  it('collapsed: a back card peeks PEEK above the front top regardless of its own height', () => {
    expect(stackOffset(ids, heights, 2, 0)).toBeCloseTo(-(60 + PEEK - 70))
    expect(stackOffset(ids, heights, 1, 0)).toBeCloseTo(-(60 + 2 * PEEK - 80))
  })

  it('expanded: a card sits above the accumulated heights of the cards in front + gaps', () => {
    expect(stackOffset(ids, heights, 2, 1)).toBeCloseTo(-(60 + GAP))
    expect(stackOffset(ids, heights, 1, 1)).toBeCloseTo(-(130 + 2 * GAP))
  })

  it('returns 0 for an unknown id', () => {
    expect(stackOffset(ids, heights, 99, 1)).toBeCloseTo(0)
  })

  it('falls back to the default height for unmeasured cards', () => {
    expect(stackOffset([1, 2], sizes([]), 1, 1)).toBeCloseTo(-(DEFAULT_HEIGHT + GAP))
  })
})

describe('stackHeight', () => {
  it('is 1 when empty', () => {
    expect(stackHeight([], new Map(), 0)).toBe(1)
  })

  it('collapsed: front height plus a peek per visible card (capped at VISIBLE_TOASTS)', () => {
    const heights = sizes([
      [1, 80],
      [2, 70],
      [3, 60],
    ])
    expect(stackHeight([1, 2, 3], heights, 0)).toBe(60 + 2 * PEEK)
    expect(stackHeight([1, 2, 3, 4], sizes([[4, 60]]), 0)).toBe(60 + 2 * PEEK)
  })

  it('expanded: sum of every height plus gaps', () => {
    const heights = sizes([
      [1, 80],
      [2, 70],
      [3, 60],
    ])
    expect(stackHeight([1, 2, 3], heights, 1)).toBe(80 + 70 + 60 + 2 * GAP)
  })
})
