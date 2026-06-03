import { Gtk } from 'ags/gtk4'

import type { FC } from '../../utils/types'

type PanelProps = {
  width?: number
  spacing?: number
  vexpand?: boolean
  children?: JSX.Element | JSX.Element[]
}

export const Panel: FC<PanelProps> = ({ width = 420, spacing = 0, vexpand = true, children }) => (
  <box
    class="bg-surface border-elevated rounded-12 m-3 border-2 border-solid"
    orientation={Gtk.Orientation.VERTICAL}
    widthRequest={width}
    overflow={Gtk.Overflow.HIDDEN}
    spacing={spacing}
    vexpand={vexpand}
  >
    {children}
  </box>
)
