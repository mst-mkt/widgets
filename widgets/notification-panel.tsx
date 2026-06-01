import { Astal, Gdk, Gtk } from 'ags/gtk4'
import app from 'ags/gtk4/app'

import { Panel } from '../components/shared/panel'
import { PanelOverlay, panelProgress } from '../components/shared/panel-overlay'
import { closePanel, isPanelOpen } from '../stores/panel'

export const NotificationPanelWidget = (gdkmonitor?: Gdk.Monitor) => {
  const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor

  const progress = panelProgress(isPanelOpen('notification'))

  return (
    <window
      visible={progress.as((p) => p > 0.01)}
      name="notification-panel"
      namespace="notification-panel"
      class="bg-transparent"
      gdkmonitor={gdkmonitor}
      anchor={TOP | BOTTOM | LEFT | RIGHT}
      exclusivity={Astal.Exclusivity.NORMAL}
      layer={Astal.Layer.OVERLAY}
      keymode={Astal.Keymode.ON_DEMAND}
      application={app}
    >
      <PanelOverlay
        progress={progress}
        onClose={closePanel}
        align={Gtk.Align.END}
        hiddenOffset={[64, 0]}
      >
        <Panel />
      </PanelOverlay>
    </window>
  )
}
