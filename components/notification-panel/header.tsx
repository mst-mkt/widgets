import { Gtk } from 'ags/gtk4'

import { today } from '../../services/clock'
import { dismissAll, hasNotifications } from '../../services/notifications'
import type { FC } from '../../utils/types'
import { Button } from '../shared/button'
import { Icon } from '../shared/icon'

export const NotificationHeader: FC = () => (
  <centerbox class="px-8 py-6">
    <box $type="start" orientation={Gtk.Orientation.VERTICAL} valign={Gtk.Align.CENTER} spacing={4}>
      <label class="text-ink text-16 font-bold" xalign={0} label="Notifications" />
      <label class="text-faint text-12" xalign={0} label={today} />
    </box>
    <Button
      $type="end"
      class="hover:bg-elevated rounded-8 min-h-8 min-w-8 transition"
      valign={Gtk.Align.CENTER}
      tooltipText="Clear all"
      visible={hasNotifications}
      onClicked={dismissAll}
    >
      <Icon icon="trash-2" size={16} class="text-mute font-light" />
    </Button>
  </centerbox>
)
