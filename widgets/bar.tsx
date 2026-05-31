import { Astal, Gdk } from 'ags/gtk4'
import app from 'ags/gtk4/app'

import { Workspaces } from '../components/bar/workspaces'

export const Bar = (gdkmonitor?: Gdk.Monitor) => {
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
      <centerbox class="mb-3">
        <Workspaces $type="center" />
      </centerbox>
    </window>
  )
}
