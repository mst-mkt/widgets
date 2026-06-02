import { Astal, Gdk } from 'ags/gtk4'
import app from 'ags/gtk4/app'

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
        <NotificationButton $type="end" />
      </centerbox>
    </window>
  )
}
