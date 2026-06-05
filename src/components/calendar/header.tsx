import { Gtk } from 'ags/gtk4'

import { todayDate } from '../../stores/calendar'
import type { FC } from '../../utils/types'

export const CalendarHeader: FC = () => (
  <box class="px-3 pt-1 pb-4" valign={Gtk.Align.CENTER}>
    <label
      class="text-ink text-15 font-semibold"
      xalign={0}
      hexpand
      label={todayDate.as(({ year, month, day }) => `${year}年${month}月${day}日`)}
    />
  </box>
)
