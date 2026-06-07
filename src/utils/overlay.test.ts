import { describe, expect, it, vi } from 'vite-plus/test'

import { createOverlay, createWidget } from '../../test/mocks/ags-gtk4'
import { appendOverlayChild, removeOverlayChild } from './overlay'

vi.mock('ags', () => import('../../test/mocks/ags'))

describe('appendOverlayChild', () => {
  it('routes $type="overlay" children to add_overlay and the main child to set_child', () => {
    const overlay = createOverlay()
    const main = createWidget()
    const child = createWidget()

    appendOverlayChild(overlay, main, null)
    expect(overlay.set_child).toHaveBeenCalledWith(main)

    appendOverlayChild(overlay, child, 'overlay')
    expect(overlay.add_overlay).toHaveBeenCalledWith(child)
  })
})

describe('removeOverlayChild', () => {
  it('removes the main child via set_child(null) and overlay children via remove_overlay', () => {
    const overlay = createOverlay()
    const main = createWidget()
    const child = createWidget()
    overlay.set_child(main)

    removeOverlayChild(overlay, main)
    expect(overlay.set_child).toHaveBeenLastCalledWith(null)

    removeOverlayChild(overlay, child)
    expect(overlay.remove_overlay).toHaveBeenCalledWith(child)
  })
})
