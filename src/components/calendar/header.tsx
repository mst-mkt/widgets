import { Gtk } from 'ags/gtk4'

import { goToday, nextMonth, prevMonth, viewMonth } from '../../stores/calendar'
import { formatYearMonth } from '../../utils/format'
import type { FC } from '../../utils/types'
import { Button } from '../shared/button'
import { Icon } from '../shared/icon'

export const CalendarHeader: FC = () => (
  <box class="pt-1 pb-4 pl-2" spacing={2} valign={Gtk.Align.CENTER}>
    <Button hexpand onClicked={goToday}>
      <label
        class="text-ink text-15 font-semibold"
        xalign={0}
        hexpand
        label={viewMonth.as(formatYearMonth)}
      />
    </Button>
    <Button
      class="hover:bg-elevated rounded-8 min-h-7 min-w-7 transition"
      valign={Gtk.Align.CENTER}
      onClicked={prevMonth}
    >
      <Icon icon="chevron-left" size={16} class="text-mute" />
    </Button>
    <Button
      class="hover:bg-elevated rounded-8 min-h-7 min-w-7 transition"
      valign={Gtk.Align.CENTER}
      onClicked={nextMonth}
    >
      <Icon icon="chevron-right" size={16} class="text-mute" />
    </Button>
  </box>
)
