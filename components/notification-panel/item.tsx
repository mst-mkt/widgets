import { With, type Accessor } from 'ags'
import { Gtk } from 'ags/gtk4'

import { activate, interactiveActions, type Notification } from '../../services/notifications'
import { compose, onReleased, pointer } from '../../utils/controllers'
import { filePath } from '../../utils/file'
import type { FC } from '../../utils/types'
import { NotificationActions } from './actions'

type NotificationItemProps = {
  current: Accessor<Notification>
}

export const NotificationItem: FC<NotificationItemProps> = ({ current }) => {
  const id = current.peek().id

  return (
    <box
      class="hover:bg-card px-8 py-2 transition"
      orientation={Gtk.Orientation.VERTICAL}
      hexpand
      spacing={8}
    >
      <box spacing={16}>
        <With value={current.as((notification) => filePath(notification.image))}>
          {(path: string | null) =>
            path !== null ? (
              <box
                class="rounded-8"
                overflow={Gtk.Overflow.HIDDEN}
                halign={Gtk.Align.START}
                valign={Gtk.Align.START}
              >
                <image file={path} pixelSize={36} />
              </box>
            ) : null
          }
        </With>
        <box
          hexpand
          orientation={Gtk.Orientation.VERTICAL}
          spacing={4}
          $={compose(
            pointer,
            onReleased(() => activate(current.peek())),
          )}
        >
          <box spacing={8} valign={Gtk.Align.CENTER}>
            <box
              class="bg-gold min-h-2 min-w-2 rounded-full"
              valign={Gtk.Align.CENTER}
              visible={current.as((notification) => notification.urgency === 2)}
            />
            <label
              class="text-ink text-[14px]"
              css="font-weight: 500;"
              xalign={0}
              hexpand
              wrap
              maxWidthChars={1}
              label={current.as((notification) => notification.summary)}
            />
          </box>
          <label
            class="text-dim text-[12px]"
            xalign={0}
            wrap
            maxWidthChars={1}
            visible={current.as((notification) => notification.body !== '')}
            label={current.as((notification) => notification.body)}
          />
        </box>
      </box>
      <NotificationActions
        id={id}
        actions={current.as((notification) => interactiveActions(notification.actions))}
      />
    </box>
  )
}
