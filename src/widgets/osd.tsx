import { Astal, type Gdk } from 'ags/gtk4'
import app from 'ags/gtk4/app'

import { OsdBar } from '../components/osd/osd-bar'
import { content, visible } from '../stores/osd'
import { slide } from '../utils/transition'
import { tweened } from '../utils/tweened'

export const Osd = (gdkmonitor?: Gdk.Monitor) => {
  const { BOTTOM } = Astal.WindowAnchor

  const progress = tweened(
    visible.as((open) => (open ? 1 : 0)),
    { duration: 240 },
  )
  const level = tweened(
    content.as((c) => c.value),
    { duration: 200 },
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
      <box class="mx-3 mb-8" css={progress.as(slide([0, 12]))}>
        <OsdBar icon={content.as((c) => c.icon)} value={level} />
      </box>
    </window>
  )
}
