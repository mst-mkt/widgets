import { describe, expect, it, vi } from 'vite-plus/test'

import { mergeClass } from './class'

vi.mock('ags', () => import('../../test/mocks/ags'))

const { createState } = await import('ags')

describe('mergeClass', () => {
  it('merges a static className onto the base', () => {
    const result = mergeClass('font-icon', 'text-mute')

    expect(result).toContain('font-icon')
    expect(result).toContain('text-mute')
  })

  it('returns just the base when no className is given', () => {
    const result = mergeClass('font-icon')

    expect(result).toContain('font-icon')
  })

  it('maps over a reactive className and resolves to the merged string', () => {
    const [className] = createState('text-mute')

    const result = mergeClass('font-icon', className)

    expect(typeof result).toBe('function')
    if (typeof result !== 'string') {
      expect(result.peek()).toContain('text-mute')
    }
  })
})
