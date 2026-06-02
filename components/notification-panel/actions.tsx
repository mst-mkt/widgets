import { For, type Accessor } from 'ags'
import { Gtk } from 'ags/gtk4'

import { invoke, type NotificationAction } from '../../services/notifications'
import type { FC } from '../../utils/types'
import { Button } from '../shared/button'

type NotificationActionsProps = {
  id: number
  actions: Accessor<NotificationAction[]>
}

export const NotificationActions: FC<NotificationActionsProps> = ({ id, actions }) => (
  <box spacing={8} homogeneous visible={actions.as((list) => list.length > 0)}>
    <For each={actions} id={(action: NotificationAction) => action.id}>
      {(action: NotificationAction) => (
        <Button
          class="bg-elevated hover:bg-card rounded-8 px-2 py-1 transition"
          onClicked={() => invoke(id, action.id)}
        >
          <label class="text-dim text-[12px]" valign={Gtk.Align.CENTER} label={action.label} />
        </Button>
      )}
    </For>
  </box>
)
