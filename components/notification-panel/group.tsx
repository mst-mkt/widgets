import { For, With } from 'ags'
import { Gtk } from 'ags/gtk4'

import { resolveApp } from '../../services/applications'
import { groupKey, groups, notifications, type Notification } from '../../services/notifications'
import type { FC } from '../../utils/types'
import { AppIcon } from './app-icon'
import { NotificationItem } from './item'

type NotificationGroupProps = {
  groupKey: string
}

export const NotificationGroup: FC<NotificationGroupProps> = ({ groupKey: key }) => {
  const identity = groups.as((list) => {
    const group = list.find((entry) => entry.key === key)
    return group ? resolveApp(group) : { name: '', icon: '' }
  })

  const items = notifications.as((list) =>
    list.filter((notification) => groupKey(notification) === key),
  )

  return (
    <box orientation={Gtk.Orientation.VERTICAL} spacing={8}>
      <box class="px-8" spacing={10} valign={Gtk.Align.CENTER}>
        <With value={identity.as((value) => value.icon)}>
          {(icon: string) => <AppIcon icon={icon} size={24} />}
        </With>
        <label
          class="text-mute text-[14px]"
          xalign={0}
          label={identity.as((value) => value.name)}
        />
      </box>
      <box orientation={Gtk.Orientation.VERTICAL}>
        <For each={items} id={(notification: Notification) => notification.id}>
          {(notification: Notification) => (
            <NotificationItem
              current={items.as(
                (list) => list.find((n) => n.id === notification.id) ?? notification,
              )}
            />
          )}
        </For>
      </box>
    </box>
  )
}
