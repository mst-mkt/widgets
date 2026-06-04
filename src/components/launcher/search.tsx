import { Gdk, Gtk } from 'ags/gtk4'

import { launchSelected, moveSelection, query, setQuery } from '../../stores/launcher'
import { compose, onKeyPress } from '../../utils/controllers'
import type { FC } from '../../utils/types'
import { Icon } from '../shared/icon'

const navigate = onKeyPress((keyval) => {
  if (keyval === Gdk.KEY_Up) {
    moveSelection(-1)
    return true
  }

  if (keyval === Gdk.KEY_Down) {
    moveSelection(1)
    return true
  }

  return false
})

const focusEntry = (self: Gtk.Widget) => {
  let wired = false

  self.connect('map', () => {
    self.grab_focus()
    if (wired) return

    const root = self.get_root()
    if (root instanceof Gtk.Window) {
      wired = true
      root.connect('notify::is-active', () => {
        if (root.is_active) self.grab_focus()
      })
    }
  })
}

export const LauncherSearch: FC = () => (
  <box class="px-5 py-3" spacing={14} valign={Gtk.Align.CENTER}>
    <Icon icon="search" size={18} class="text-mute" />
    <entry
      class="launcher-entry text-ink text-16 bg-transparent p-0"
      hexpand
      hasFrame={false}
      placeholderText="Search applications…"
      text={query}
      onNotifyText={(self: Gtk.Entry) => setQuery(self.get_text())}
      onActivate={launchSelected}
      $={compose(navigate, focusEntry)}
    />
  </box>
)
