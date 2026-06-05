import { With } from 'ags'
import { Gtk } from 'ags/gtk4'

import { todayDate, viewMonth } from '../../stores/calendar'
import { isSameDay, monthMatrix, type CalDate } from '../../utils/calendar'
import type { FC } from '../../utils/types'

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

const weekdayColor = (index: number) => {
  if (index === 0) return 'text-holiday'
  if (index === 6) return 'text-saturday'
  return 'text-faint'
}

const DayCell = (date: CalDate | null) => {
  if (date === null) return <box hexpand />

  return (
    <box hexpand>
      <box
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}
        class={todayDate.as((t) =>
          isSameDay(date, t) ? 'bg-gold min-h-8 min-w-8 rounded-full' : 'min-h-8 min-w-8',
        )}
      >
        <label
          halign={Gtk.Align.CENTER}
          valign={Gtk.Align.CENTER}
          hexpand
          class={todayDate.as((t) =>
            isSameDay(date, t) ? 'text-coal text-13 font-semibold' : 'text-dim text-13',
          )}
          label={`${date.day}`}
        />
      </box>
    </box>
  )
}

export const CalendarGrid: FC = () => (
  <box orientation={Gtk.Orientation.VERTICAL}>
    <box homogeneous class="pb-2">
      {WEEKDAYS.map((weekday, index) => (
        <label class={`text-11 ${weekdayColor(index)}`} label={weekday} />
      ))}
    </box>
    <With value={viewMonth}>
      {({ year, month }: { year: number; month: number }) => (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={4}>
          {monthMatrix(year, month).map((week) => (
            <box homogeneous>{week.map(DayCell)}</box>
          ))}
        </box>
      )}
    </With>
  </box>
)
