import type { Accessor } from 'ags'
import { Gtk } from 'ags/gtk4'
import Pango from 'gi://Pango'

import { resolveApp } from '../../services/applications'
import type { Notification } from '../../services/notifications'
import { activateToast } from '../../stores/toast'
import { compose, onReleased, pointer } from '../../utils/controllers'
import { filePath } from '../../utils/file'
import { TOAST_WIDTH } from '../../utils/toast'
import type { FC } from '../../utils/types'
import { AppIcon } from '../notification-panel/app-icon'

const singleLine = (value: string) => value.replace(/\s*\n\s*/g, ' ').trim()

type NotificationToastCardProps = {
  id: number
  current: Accessor<Notification | undefined>
}

export const NotificationToastCard: FC<NotificationToastCardProps> = ({ id, current }) => {
  const source = current.peek()
  const imagePath = source === undefined ? null : filePath(source.image)
  const appIcon = source === undefined ? '' : resolveApp(source).icon

  return (
    <box
      class="bg-surface border-elevated rounded-12 border-2 border-solid px-4 py-3"
      widthRequest={TOAST_WIDTH}
      valign={Gtk.Align.CENTER}
      spacing={12}
      $={compose(
        pointer,
        onReleased(() => activateToast(id)),
      )}
    >
      {imagePath !== null ? (
        <box
          class="rounded-8"
          overflow={Gtk.Overflow.HIDDEN}
          widthRequest={40}
          heightRequest={40}
          halign={Gtk.Align.CENTER}
          valign={Gtk.Align.START}
        >
          <image
            file={imagePath}
            pixelSize={40}
            halign={Gtk.Align.CENTER}
            valign={Gtk.Align.CENTER}
          />
        </box>
      ) : (
        <AppIcon icon={appIcon} size={40} />
      )}
      <box hexpand orientation={Gtk.Orientation.VERTICAL} valign={Gtk.Align.CENTER} spacing={2}>
        <box spacing={8} valign={Gtk.Align.CENTER}>
          <box
            class="bg-gold min-h-2 min-w-2 rounded-full"
            valign={Gtk.Align.CENTER}
            visible={current.as((notification) => notification?.urgency === 2)}
          />
          <label
            class="text-ink text-14 font-medium"
            xalign={0}
            hexpand
            maxWidthChars={1}
            ellipsize={Pango.EllipsizeMode.END}
            label={current.as((notification) =>
              notification === undefined ? '' : singleLine(notification.summary),
            )}
          />
        </box>
        <label
          class="text-dim text-12"
          xalign={0}
          wrap
          lines={2}
          maxWidthChars={1}
          ellipsize={Pango.EllipsizeMode.END}
          visible={current.as((notification) => (notification?.body ?? '') !== '')}
          label={current.as((notification) => notification?.body ?? '')}
        />
      </box>
    </box>
  )
}
