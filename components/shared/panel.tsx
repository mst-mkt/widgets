import { Gtk } from 'ags/gtk4'

import type { FC } from '../../utils/types'

type PanelProps = {
  width?: number
  children?: JSX.Element
}

export const Panel: FC<PanelProps> = ({ width = 420, children }) => (
  <box
    class="bg-surface border-elevated rounded-12 m-3 border-2 border-solid"
    orientation={Gtk.Orientation.VERTICAL}
    widthRequest={width}
    vexpand={true}
  >
    {children}
  </box>
)
