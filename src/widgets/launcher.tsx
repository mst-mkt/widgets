import { With } from 'ags'
import { Astal, Gdk, Gtk } from 'ags/gtk4'
import app from 'ags/gtk4/app'

import { LauncherEmpty } from '../components/launcher/empty'
import { LauncherFooter } from '../components/launcher/footer'
import { LauncherList, LIST_HEIGHT } from '../components/launcher/list'
import { LauncherSearch } from '../components/launcher/search'
import { Panel } from '../components/shared/panel'
import { PanelOverlay } from '../components/shared/panel-overlay'
import { hasResults } from '../stores/launcher'
import { closePanel, isPanelOpen } from '../stores/panel'
import { tweened } from '../utils/tweened'

export const LauncherWidget = (gdkmonitor?: Gdk.Monitor) => {
  const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor

  const open = isPanelOpen('launcher')
  const progress = tweened(
    open.as((o) => (o ? 1 : 0)),
    { duration: 240 },
  )

  return (
    <window
      visible={progress.as((p) => p > 0.01)}
      name="widgets:launcher"
      namespace="widgets:launcher"
      class="bg-transparent"
      gdkmonitor={gdkmonitor}
      anchor={TOP | BOTTOM | LEFT | RIGHT}
      exclusivity={Astal.Exclusivity.NORMAL}
      layer={Astal.Layer.OVERLAY}
      keymode={open.as((o) => (o ? Astal.Keymode.EXCLUSIVE : Astal.Keymode.NONE))}
      application={app}
    >
      <PanelOverlay
        progress={progress}
        onClose={closePanel}
        align={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}
        hiddenOffset={[0, -16]}
      >
        <Panel width={560} vexpand={false}>
          <LauncherSearch />
          <box class="bg-elevated" heightRequest={1} />
          <box orientation={Gtk.Orientation.VERTICAL} heightRequest={LIST_HEIGHT} vexpand={false}>
            <With value={hasResults}>
              {(has: boolean) => (has ? <LauncherList /> : <LauncherEmpty />)}
            </With>
          </box>
          <box class="bg-elevated" heightRequest={1} />
          <LauncherFooter />
        </Panel>
      </PanelOverlay>
    </window>
  )
}
