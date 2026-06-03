import { Gtk } from 'ags/gtk4'

import type { FC } from '../../utils/types'
import { Icon } from '../shared/icon'

export const PlayerEmpty: FC = () => (
  <box
    class="px-6 py-10"
    orientation={Gtk.Orientation.VERTICAL}
    halign={Gtk.Align.CENTER}
    valign={Gtk.Align.CENTER}
    hexpand
    spacing={16}
  >
    <Icon icon="music" size={24} class="text-ghost" />
    <label class="text-ghost text-12" label="No Media" />
  </box>
)
