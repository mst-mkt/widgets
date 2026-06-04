import { Astal, type Gdk, Gtk } from 'ags/gtk4'
import app from 'ags/gtk4/app'

import { OsdBar } from '../components/osd/osd-bar'
import { content, visible } from '../stores/osd'
import { isPanelOpen } from '../stores/panel'
import { slide } from '../utils/transition'
import { tweened } from '../utils/tweened'

const MARGIN_DEFAULT = 32
const PLAYER_HEIGHT = 128
const MARGIN_ABOVE_PLAYER = MARGIN_DEFAULT + PLAYER_HEIGHT

export const OsdWidget = (gdkmonitor?: Gdk.Monitor) => {
  const { BOTTOM } = Astal.WindowAnchor

  const progress = tweened(
    visible.as((open) => (open ? 1 : 0)),
    { duration: 240 },
  )
  const playerProgress = tweened(
    isPanelOpen('player').as((open) => (open ? 1 : 0)),
    { duration: 280 },
  )

  return (
    <window
      visible={progress.as((p) => p > 0.01)}
      name="osd"
      namespace="osd"
      class="bg-transparent"
      gdkmonitor={gdkmonitor}
      anchor={BOTTOM}
      exclusivity={Astal.Exclusivity.NORMAL}
      layer={Astal.Layer.OVERLAY}
      keymode={Astal.Keymode.NONE}
      application={app}
    >
      <box
        class="mx-3"
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.END}
        marginBottom={playerProgress.as((p) => (p < 0.5 ? MARGIN_DEFAULT : MARGIN_ABOVE_PLAYER))}
        css={progress.as(slide([0, 12]))}
      >
        <box css={playerProgress.as((p) => `opacity: ${Math.abs(2 * p - 1)};`)}>
          <OsdBar icon={content.as((c) => c.icon)} value={content.as((c) => c.value)} />
        </box>
      </box>
    </window>
  )
}
