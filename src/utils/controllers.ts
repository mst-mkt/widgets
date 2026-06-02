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

export const autofocus = (self: Gtk.Widget) => {
  self.set_focusable(true)
  self.connect('map', () => {
    if (!self.child_focus(Gtk.DirectionType.TAB_FORWARD)) self.grab_focus()
  })
}
