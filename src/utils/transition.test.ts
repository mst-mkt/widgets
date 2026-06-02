import { describe, expect, it } from 'vite-plus/test'

import { slide } from './transition'

describe('slide', () => {
  it('is fully hidden and offset at t=0', () => {
    const css = slide([64, 0])(0)

    expect(css).toContain('opacity: 0')
    expect(css).toContain('translate(64px, 0px)')
  })

  it('is fully shown and settled at t=1', () => {
    const css = slide([64, 0])(1)

    expect(css).toContain('opacity: 1')
    expect(css).toContain('translate(0px, 0px)')
  })

  it('interpolates the offset on both axes', () => {
    const css = slide([100, 40])(0.25)

    expect(css).toContain('opacity: 0.25')
    expect(css).toContain('translate(75px, 30px)')
  })
})
