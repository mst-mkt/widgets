import { createComputed } from 'ags'
import { Gtk } from 'ags/gtk4'

import { goToday, nextMonth, prevMonth, selectedDate, viewMonth } from '../../stores/calendar'
import { isSameMonth } from '../../utils/calendar'
import { formatYearMonth, formatYearMonthDay } from '../../utils/format'
import type { FC } from '../../utils/types'
import { Button } from '../shared/button'
import { Icon } from '../shared/icon'

const navClass = 'hover:bg-elevated rounded-8 min-h-7 min-w-7 transition'

export const CalendarHeader: FC = () => {
  const label = createComputed(() => {
    const view = viewMonth()
    const selected = selectedDate()
    return isSameMonth(selected, view) ? formatYearMonthDay(selected) : formatYearMonth(view)
  })

  return (
    <box class="pt-1 pb-4 pl-2" spacing={2} valign={Gtk.Align.CENTER}>
      <Button hexpand onClicked={goToday}>
        <label class="text-ink text-15 font-semibold" xalign={0} hexpand label={label} />
      </Button>
      <Button class={navClass} valign={Gtk.Align.CENTER} onClicked={prevMonth}>
        <Icon icon="chevron-left" size={16} class="text-mute" />
      </Button>
      <Button class={navClass} valign={Gtk.Align.CENTER} onClicked={nextMonth}>
        <Icon icon="chevron-right" size={16} class="text-mute" />
      </Button>
    </box>
  )
}
