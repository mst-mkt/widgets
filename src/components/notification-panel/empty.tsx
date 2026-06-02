import { Gtk } from 'ags/gtk4'

import type { FC } from '../../utils/types'
import { Icon } from '../shared/icon'

export const NotificationEmpty: FC = () => (
  <box
    orientation={Gtk.Orientation.VERTICAL}
    halign={Gtk.Align.CENTER}
    valign={Gtk.Align.CENTER}
    hexpand
    vexpand
    spacing={16}
  >
    <Icon icon="bell-off" size={24} class="text-ghost" />
    <label class="text-ghost text-12" label="No Notifications" />
  </box>
)
