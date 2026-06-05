import { With } from 'ags'
import { Astal, Gdk, Gtk } from 'ags/gtk4'
import app from 'ags/gtk4/app'

import { NotificationEmpty } from '../components/notification-panel/empty'
import { NotificationHeader } from '../components/notification-panel/header'
import { NotificationList } from '../components/notification-panel/list'
import { Panel } from '../components/shared/panel'
import { PanelOverlay } from '../components/shared/panel-overlay'
import { hasNotifications } from '../services/notifications'
import { closePanel, isPanelOpen } from '../stores/panel'
import { tweened } from '../utils/tweened'

export const NotificationPanelWidget = (gdkmonitor?: Gdk.Monitor) => {
  const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor

  const progress = tweened(
    isPanelOpen('notification').as((open) => (open ? 1 : 0)),
    { duration: 280 },
  )

  return (
    <window
      visible={progress.as((p) => p > 0.01)}
      name="widgets:notification-panel"
      namespace="widgets:notification-panel"
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
        hiddenOffset={[64, 0]}
      >
        <Panel spacing={8}>
          <NotificationHeader />
          <With value={hasNotifications}>
            {(has: boolean) => (has ? <NotificationList /> : <NotificationEmpty />)}
          </With>
        </Panel>
      </PanelOverlay>
    </window>
  )
}
