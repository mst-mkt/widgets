import { Gtk } from 'ags/gtk4'
import Pango from 'gi://Pango'

import { artist, title } from '../../services/player'
import type { FC } from '../../utils/types'

export const PlayerMeta: FC = () => (
  <box orientation={Gtk.Orientation.VERTICAL} valign={Gtk.Align.CENTER} hexpand spacing={4}>
    <label
      class="text-ink text-14 font-semibold"
      xalign={0}
      hexpand
      maxWidthChars={1}
      ellipsize={Pango.EllipsizeMode.END}
      label={title}
    />
    <label
      class="text-dim text-12"
      xalign={0}
      hexpand
      maxWidthChars={1}
      ellipsize={Pango.EllipsizeMode.END}
      label={artist}
    />
  </box>
)
