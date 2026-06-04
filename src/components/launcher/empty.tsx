import { Gtk } from 'ags/gtk4'

import type { FC } from '../../utils/types'
import { Icon } from '../shared/icon'

export const LauncherEmpty: FC = () => (
  <box
    class="px-6"
    orientation={Gtk.Orientation.VERTICAL}
    halign={Gtk.Align.CENTER}
    valign={Gtk.Align.CENTER}
    hexpand
    vexpand
    spacing={14}
  >
    <Icon icon="search-x" size={26} class="text-ghost" />
    <label class="text-ghost text-12" label="No applications found" />
  </box>
)
