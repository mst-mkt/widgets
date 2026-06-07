import { appendChild, removeChild } from 'ags'
import type { Gtk } from 'ags/gtk4'

type OverlayHost = Pick<Gtk.Overlay, 'add_overlay' | 'remove_overlay' | 'set_child' | 'get_child'>

export const appendOverlayChild = (
  overlay: OverlayHost,
  child: Gtk.Widget,
  type: string | null,
) => {
  if (type === 'overlay') overlay.add_overlay(child)
  else overlay.set_child(child)
}

export const removeOverlayChild = (overlay: OverlayHost, child: Gtk.Widget) => {
  if (overlay.get_child() === child) overlay.set_child(null)
  else overlay.remove_overlay(child)
}

export const routeOverlayChildren = (overlay: Gtk.Overlay) => {
  Object.assign(overlay, {
    [appendChild]: (child: Gtk.Widget, type: string | null) => {
      appendOverlayChild(overlay, child, type)
    },
    [removeChild]: (child: Gtk.Widget) => {
      removeOverlayChild(overlay, child)
    },
  })
}
