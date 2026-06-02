import type { Accessor } from 'ags'
import { Gtk } from 'ags/gtk4'

import { clamp } from '../../utils/math'
import type { FC } from '../../utils/types'
import { Icon, type IconName } from '../shared/icon'

const BAR_WIDTH = 180
const BAR_HEIGHT = 6

type OsdBarProps = {
  icon: Accessor<IconName>
  value: Accessor<number>
}

export const OsdBar: FC<OsdBarProps> = ({ icon, value }) => (
  <box class="bg-surface border-elevated rounded-16 border-2 border-solid px-4 py-3" spacing={12}>
    <Icon icon={icon} class="text-dim" size={20} />
    <box
      class="bg-elevated rounded-full"
      widthRequest={BAR_WIDTH}
      heightRequest={BAR_HEIGHT}
      valign={Gtk.Align.CENTER}
      overflow={Gtk.Overflow.HIDDEN}
    >
      <box
        class="bg-gold rounded-full"
        halign={Gtk.Align.START}
        vexpand
        widthRequest={value.as((v) => Math.round(clamp(v, 0, 1) * BAR_WIDTH))}
      />
    </box>
  </box>
)
