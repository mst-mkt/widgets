import { For } from 'ags'
import { Gtk } from 'ags/gtk4'

import { groups, type AppGroup } from '../../services/notifications'
import type { FC } from '../../utils/types'
import { NotificationGroup } from './group'

export const NotificationList: FC = () => (
  <scrolledwindow
    vexpand
    hscrollbarPolicy={Gtk.PolicyType.NEVER}
    vscrollbarPolicy={Gtk.PolicyType.EXTERNAL}
  >
    <box orientation={Gtk.Orientation.VERTICAL} spacing={24} class="pb-8">
      <For each={groups} id={(group: AppGroup) => group.key}>
        {(group: AppGroup) => <NotificationGroup groupKey={group.key} />}
      </For>
    </box>
  </scrolledwindow>
)
