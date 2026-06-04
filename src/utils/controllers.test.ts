import { describe, expect, it, vi } from 'vite-plus/test'

import { createWidget, Gdk } from '../../test/mocks/ags-gtk4'
import {
  autofocus,
  compose,
  onEscape,
  onHover,
  onKeyPress,
  onPressed,
  onReleased,
  pointer,
} from './controllers'

vi.mock('ags/gtk4', () => import('../../test/mocks/ags-gtk4'))

describe('compose', () => {
  it('runs every setup with the widget, in order', () => {
    const order: string[] = []
    const widget = createWidget()

    compose(
      () => order.push('a'),
      () => order.push('b'),
    )(widget)

    expect(order).toEqual(['a', 'b'])
  })
})

describe('pointer', () => {
  it('sets the pointer cursor', () => {
    const widget = createWidget()

    pointer(widget)

    expect(widget.set_cursor_from_name).toHaveBeenCalledWith('pointer')
  })
})

describe('onPressed', () => {
  it('runs the handler when the gesture is pressed', () => {
    const handler = vi.fn()
    const widget = createWidget()
    onPressed(handler)(widget)

    widget.controllers[0]?.emit('pressed')

    expect(handler).toHaveBeenCalledOnce()
  })
})

describe('onReleased', () => {
  it('runs the handler when the gesture is released', () => {
    const handler = vi.fn()
    const widget = createWidget()
    onReleased(handler)(widget)

    widget.controllers[0]?.emit('released')

    expect(handler).toHaveBeenCalledOnce()
  })
})

describe('onHover', () => {
  it('runs the handler when the pointer enters', () => {
    const handler = vi.fn()
    const widget = createWidget()
    onHover(handler)(widget)

    widget.controllers[0]?.emit('enter')

    expect(handler).toHaveBeenCalledOnce()
  })
})

describe('onEscape', () => {
  it('runs the handler and stops propagation on Escape', () => {
    const handler = vi.fn()
    const widget = createWidget()
    onEscape(handler)(widget)

    const handled = widget.controllers[0]?.emit('key-pressed', Gdk.KEY_Escape)

    expect(handler).toHaveBeenCalledOnce()
    expect(handled).toBe(true)
  })

  it('ignores other keys and lets them propagate', () => {
    const handler = vi.fn()
    const widget = createWidget()
    onEscape(handler)(widget)

    const handled = widget.controllers[0]?.emit('key-pressed', 0x61)

    expect(handler).not.toHaveBeenCalled()
    expect(handled).toBe(false)
  })
})

describe('onKeyPress', () => {
  it('forwards the keyval to the handler and propagates its result', () => {
    const handler = vi.fn(() => true)
    const widget = createWidget()
    onKeyPress(handler)(widget)

    const handled = widget.controllers[0]?.emit('key-pressed', 0xff52)

    expect(handler).toHaveBeenCalledWith(0xff52)
    expect(handled).toBe(true)
  })

  it('lets unhandled keys propagate', () => {
    const handler = vi.fn(() => false)
    const widget = createWidget()
    onKeyPress(handler)(widget)

    const handled = widget.controllers[0]?.emit('key-pressed', 0x61)

    expect(handled).toBe(false)
  })
})

describe('autofocus', () => {
  it('moves focus into a focusable child when mapped', () => {
    const widget = createWidget(true)
    autofocus(widget)

    widget.map()

    expect(widget.set_focusable).toHaveBeenCalledWith(true)
    expect(widget.child_focus).toHaveBeenCalled()
    expect(widget.grab_focus).not.toHaveBeenCalled()
  })

  it('falls back to grabbing focus itself when no child takes it', () => {
    const widget = createWidget(false)
    autofocus(widget)

    widget.map()

    expect(widget.grab_focus).toHaveBeenCalledOnce()
  })
})
