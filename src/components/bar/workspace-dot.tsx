import type { Accessor } from 'ags'
import { Gtk } from 'ags/gtk4'

import type { FC } from '../../utils/types'
import { Button } from '../shared/button'

type WorkspaceDotProps = {
  active: Accessor<boolean>
  onClick: () => void
}

export const WorkspaceDot: FC<WorkspaceDotProps> = ({ active, onClick }) => (
  <Button
    class={active.as((a) =>
      a
        ? 'bg-gold min-h-[10px] min-w-6 rounded-full transition-200'
        : 'bg-ghost min-h-[10px] min-w-[10px] rounded-full transition-200',
    )}
    valign={Gtk.Align.CENTER}
    onClicked={onClick}
  />
)
