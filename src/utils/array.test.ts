import { describe, expect, it } from 'vite-plus/test'

import { idDiff } from './array'

describe('idDiff', () => {
  it('reports values added to and removed from the next set', () => {
    expect(idDiff([1, 2], [2, 3])).toEqual({ added: [3], removed: [1] })
    expect(idDiff([], [1])).toEqual({ added: [1], removed: [] })
    expect(idDiff([1], [])).toEqual({ added: [], removed: [1] })
    expect(idDiff([1, 2], [1, 2])).toEqual({ added: [], removed: [] })
  })
})
