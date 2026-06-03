import { Gtk } from 'ags/gtk4'

import { BAR_COUNT, bars } from '../../services/cava'
import type { FC } from '../../utils/types'

const HEIGHT = 24
const MIN_HEIGHT = 8
const BAR_WIDTH = 6

const GRADIENT = 'linear-gradient(to top, rgba(248, 199, 6, 0), rgba(248, 199, 6, 1))'

const barStyle = (value: number) => {
  const height = Math.round(MIN_HEIGHT + value * (HEIGHT - MIN_HEIGHT))
  return `min-height: ${height}px; background-image: ${GRADIENT};`
}

export const PlayerVisualizer: FC = () => (
  <box class="px-4" heightRequest={HEIGHT} hexpand homogeneous valign={Gtk.Align.END}>
    {Array.from({ length: BAR_COUNT }, (_, index) => (
      <box
        class="rounded-2"
        widthRequest={BAR_WIDTH}
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.END}
        css={bars.as((values) => barStyle(values[index] ?? 0))}
      />
    ))}
  </box>
)
