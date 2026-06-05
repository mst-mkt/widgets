import { Astal, Gdk, Gtk } from 'ags/gtk4'
import app from 'ags/gtk4/app'

import { CalendarGrid } from '../components/calendar/grid'
import { CalendarHeader } from '../components/calendar/header'
import { Panel } from '../components/shared/panel'
import { PanelOverlay } from '../components/shared/panel-overlay'
import { closePanel, isPanelOpen } from '../stores/panel'
import { tweened } from '../utils/tweened'

export const CalendarWidget = (gdkmonitor?: Gdk.Monitor) => {
  const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor

  const progress = tweened(
    isPanelOpen('calendar').as((open) => (open ? 1 : 0)),
    { duration: 280 },
  )

  return (
    <window
      visible={progress.as((p) => p > 0.01)}
      name="calendar"
      namespace="calendar"
      class="bg-transparent"
      gdkmonitor={gdkmonitor}
      anchor={TOP | BOTTOM | LEFT | RIGHT}
      exclusivity={Astal.Exclusivity.NORMAL}
      layer={Astal.Layer.OVERLAY}
      keymode={Astal.Keymode.NONE}
      application={app}
    >
      <PanelOverlay
        progress={progress}
        onClose={closePanel}
        align={Gtk.Align.END}
        valign={Gtk.Align.END}
        hiddenOffset={[0, 12]}
      >
        <Panel width={320} vexpand={false}>
          <box orientation={Gtk.Orientation.VERTICAL} class="p-4">
            <CalendarHeader />
            <CalendarGrid />
          </box>
        </Panel>
      </PanelOverlay>
    </window>
  )
}
