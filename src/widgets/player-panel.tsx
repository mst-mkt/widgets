import { With } from 'ags'
import { Astal, Gdk, Gtk } from 'ags/gtk4'
import app from 'ags/gtk4/app'

import { PlayerControls } from '../components/player/controls'
import { PlayerCover } from '../components/player/cover'
import { PlayerEmpty } from '../components/player/empty'
import { PlayerMeta } from '../components/player/meta'
import { PlayerVisualizer } from '../components/player/visualizer'
import { Panel } from '../components/shared/panel'
import { PanelOverlay } from '../components/shared/panel-overlay'
import { available } from '../services/player'
import { closePanel, isPanelOpen } from '../stores/panel'
import { tweened } from '../utils/tweened'

export const PlayerPanelWidget = (gdkmonitor?: Gdk.Monitor) => {
  const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor

  const progress = tweened(
    isPanelOpen('player').as((open) => (open ? 1 : 0)),
    { duration: 280 },
  )

  return (
    <window
      visible={progress.as((p) => p > 0.01)}
      name="player-panel"
      namespace="player-panel"
      class="bg-transparent"
      gdkmonitor={gdkmonitor}
      anchor={TOP | BOTTOM | LEFT | RIGHT}
      exclusivity={Astal.Exclusivity.NORMAL}
      layer={Astal.Layer.TOP}
      keymode={Astal.Keymode.NONE}
      application={app}
    >
      <PanelOverlay
        progress={progress}
        onClose={closePanel}
        align={Gtk.Align.CENTER}
        valign={Gtk.Align.END}
        hiddenOffset={[0, 12]}
      >
        <Panel width={420} vexpand={false}>
          <With value={available}>
            {(ready: boolean) =>
              ready ? (
                <box orientation={Gtk.Orientation.VERTICAL} spacing={8}>
                  <box class="px-6 pt-5" spacing={24}>
                    <PlayerCover />
                    <box
                      orientation={Gtk.Orientation.VERTICAL}
                      valign={Gtk.Align.CENTER}
                      hexpand
                      spacing={10}
                    >
                      <PlayerMeta />
                      <PlayerControls />
                    </box>
                  </box>
                  <PlayerVisualizer />
                </box>
              ) : (
                <PlayerEmpty />
              )
            }
          </With>
        </Panel>
      </PanelOverlay>
    </window>
  )
}
