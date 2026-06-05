import { createComputed, With } from 'ags'
import { Gtk } from 'ags/gtk4'

import { selectDay, selectedDate, todayDate, viewMonth } from '../../stores/calendar'
import {
  isSameDay,
  isSameMonth,
  monthMatrix,
  type CalDate,
  type YearMonth,
} from '../../utils/calendar'
import type { FC } from '../../utils/types'
import { Button } from '../shared/button'

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

const weekdayColor = (index: number) => {
  if (index === 0) return 'text-holiday'
  if (index === 6) return 'text-saturday'
  return 'text-faint'
}

type DayState = 'selected' | 'today' | 'normal'

const circleClass = (state: DayState) => {
  if (state === 'selected') return 'bg-gold min-h-8 min-w-8 rounded-full'
  if (state === 'today') return 'border-gold min-h-8 min-w-8 rounded-full'
  return 'min-h-8 min-w-8'
}

const textClass = (state: DayState, outside: boolean) => {
  if (state === 'selected') return 'text-coal text-13 font-semibold'
  if (state === 'today') return 'text-gold text-13'
  return outside ? 'text-ghost text-13' : 'text-dim text-13'
}

const DayCell = (date: CalDate, view: YearMonth) => {
  const outside = !isSameMonth(date, view)

  const state = createComputed((): DayState => {
    if (isSameDay(date, selectedDate())) return 'selected'
    if (isSameDay(date, todayDate())) return 'today'
    return 'normal'
  })

  const cell = (
    <box halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER} class={state.as(circleClass)}>
      <label
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}
        hexpand
        class={state.as((s) => textClass(s, outside))}
        label={`${date.day}`}
      />
    </box>
  )

  if (outside) return <box hexpand>{cell}</box>

  return (
    <Button hexpand onClicked={() => selectDay(date)}>
      {cell}
    </Button>
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
      {(view: YearMonth) => (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={4}>
          {monthMatrix(view.year, view.month).map((week) => (
            <box homogeneous>{week.map((date) => DayCell(date, view))}</box>
          ))}
        </box>
      )}
    </With>
  </box>
)
