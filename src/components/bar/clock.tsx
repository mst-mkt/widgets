import { Gtk } from 'ags/gtk4'

import { time } from '../../services/clock'
import { togglePanel } from '../../stores/panel'
import { formatClock } from '../../utils/format'
import type { FC } from '../../utils/types'
import { Button } from '../shared/button'

type ClockProps = {
  $type?: string
}

export const Clock: FC<ClockProps> = ({ $type }) => (
  <Button
    $type={$type}
    class="bg-surface min-h-9 rounded-full px-4"
    valign={Gtk.Align.CENTER}
    onClicked={() => togglePanel('calendar')}
  >
    <label
      class="text-dim text-11 font-mono font-normal tracking-[0.5px]"
      label={time.as(formatClock)}
    />
  </Button>
)
