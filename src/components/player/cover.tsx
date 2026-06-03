import { With } from 'ags'
import { Gdk, Gtk } from 'ags/gtk4'

import { cover } from '../../stores/cover'
import type { FC } from '../../utils/types'
import { Icon } from '../shared/icon'

const SIZE = 80

export const PlayerCover: FC = () => (
  <box
    class="bg-elevated rounded-8"
    overflow={Gtk.Overflow.HIDDEN}
    widthRequest={SIZE}
    heightRequest={SIZE}
    halign={Gtk.Align.START}
    valign={Gtk.Align.CENTER}
  >
    <With value={cover}>
      {(texture: Gdk.Texture | null) =>
        texture !== null ? (
          <image paintable={texture} pixelSize={SIZE} />
        ) : (
          <box hexpand vexpand halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER}>
            <Icon icon="music" size={28} class="text-mute" />
          </box>
        )
      }
    </With>
  </box>
)
