import { Gdk, Gtk } from 'ags/gtk4'

export const compose =
  (...setups: Array<(self: Gtk.Widget) => void>) =>
  (self: Gtk.Widget) => {
    for (const setup of setups) setup(self)
  }

export const pointer = (self: Gtk.Widget) => {
  self.set_cursor_from_name('pointer')
}

export const onPressed = (handler: () => void) => (self: Gtk.Widget) => {
  const click = new Gtk.GestureClick()
  click.connect('pressed', () => handler())
  self.add_controller(click)
}

export const onReleased = (handler: () => void) => (self: Gtk.Widget) => {
  const click = new Gtk.GestureClick()
  click.connect('released', () => handler())
  self.add_controller(click)
}

export const onHover = (handler: () => void) => (self: Gtk.Widget) => {
  const motion = new Gtk.EventControllerMotion()
  motion.connect('enter', () => handler())
  self.add_controller(motion)
}

export const onMove = (handler: (x: number, y: number) => void) => (self: Gtk.Widget) => {
  const motion = new Gtk.EventControllerMotion()
  let lastX = Number.NaN
  let lastY = Number.NaN

  motion.connect('motion', (_controller: unknown, x: number, y: number) => {
    const root = self.get_root()
    const rooted = root != null ? self.translate_coordinates(root, x, y) : null
    const px = rooted?.[0] === true ? (rooted[1] as number) : x
    const py = rooted?.[0] === true ? (rooted[2] as number) : y

    const moved = Math.abs(px - lastX) >= 1 || Math.abs(py - lastY) >= 1
    lastX = px
    lastY = py
    if (moved) handler(x, y)
  })

  self.add_controller(motion)
}

export const onEscape = (handler: () => void) => (self: Gtk.Widget) => {
  const key = new Gtk.EventControllerKey()
  key.set_propagation_phase(Gtk.PropagationPhase.CAPTURE)
  key.connect('key-pressed', (_controller, keyval) => {
    if (keyval !== Gdk.KEY_Escape) return false
    handler()
    return true
  })
  self.add_controller(key)
}

export const onKeyPress = (handler: (keyval: number) => boolean) => (self: Gtk.Widget) => {
  const key = new Gtk.EventControllerKey()
  key.set_propagation_phase(Gtk.PropagationPhase.CAPTURE)
  key.connect('key-pressed', (_controller, keyval) => handler(keyval))
  self.add_controller(key)
}

export const autofocus = (self: Gtk.Widget) => {
  self.set_focusable(true)
  self.connect('map', () => {
    if (!self.child_focus(Gtk.DirectionType.TAB_FORWARD)) self.grab_focus()
  })
}
