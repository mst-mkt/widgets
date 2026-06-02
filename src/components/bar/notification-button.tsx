import { Gtk } from 'ags/gtk4'

import { hasNotifications } from '../../services/notifications'
import { togglePanel } from '../../stores/panel'
import type { FC } from '../../utils/types'
import { Button } from '../shared/button'
import { Icon } from '../shared/icon'

type NotificationButtonProps = {
  $type?: string
}

export const NotificationButton: FC<NotificationButtonProps> = ({ $type }) => (
  <overlay $type={$type} valign={Gtk.Align.CENTER}>
    <Button
      class="bg-surface min-h-9 min-w-9 rounded-full"
      onClicked={() => togglePanel('notification')}
    >
      <Icon icon="bell" class="text-mute" />
    </Button>
    <box
      $type="overlay"
      visible={hasNotifications}
      class="bg-gold min-h-[10px] min-w-[10px] rounded-full"
      halign={Gtk.Align.END}
      valign={Gtk.Align.START}
    />
  </overlay>
)
