import { Astal, Gdk, Gtk } from 'ags/gtk4'
import app from 'ags/gtk4/app'

import { Clock } from '../components/bar/clock'
import { NotificationButton } from '../components/bar/notification-button'
import { Workspaces } from '../components/bar/workspaces'

export const BarWidget = (gdkmonitor?: Gdk.Monitor) => {
  const { BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor

  return (
    <window
      visible
      name="bar"
      class="bg-transparent"
      namespace="bar"
      gdkmonitor={gdkmonitor}
      anchor={BOTTOM | LEFT | RIGHT}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      layer={Astal.Layer.BOTTOM}
      application={app}
    >
      <centerbox class="mx-3 mb-3">
        <Workspaces $type="center" />
        <box $type="end" spacing={8} valign={Gtk.Align.CENTER}>
          <Clock />
          <NotificationButton />
        </box>
      </centerbox>
    </window>
  )
}
