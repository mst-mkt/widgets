import { createComputed, With } from 'ags'
import { Gtk } from 'ags/gtk4'
import { unoMerge } from 'unocss-merge'

import { eventDays, selectDay, selectedDate, todayDate, viewMonth } from '../../stores/calendar'
import {
  dayKey,
  isSameDay,
  isSameMonth,
  monthMatrix,
  type CalDate,
  type YearMonth,
} from '../../utils/calendar'
import type { FC } from '../../utils/types'
import { Button } from '../shared/button'

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

type DayState = 'selected' | 'today' | 'normal'

const DayCell = (date: CalDate, view: YearMonth) => {
  const outside = !isSameMonth(date, view)

  const state = createComputed((): DayState => {
    if (isSameDay(date, selectedDate())) return 'selected'
    if (isSameDay(date, todayDate())) return 'today'
    return 'normal'
  })

  const showDot = createComputed(() => state() !== 'selected' && eventDays().has(dayKey(date)))

  const cell = (
    <overlay>
      <box
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}
        class={state.as((s) =>
          unoMerge(
            'min-h-8 min-w-8',
            s === 'selected' && 'bg-gold rounded-full',
            s === 'today' && 'border-gold rounded-full',
          ),
        )}
      >
        <label
          halign={Gtk.Align.CENTER}
          valign={Gtk.Align.CENTER}
          hexpand
          class={state.as((s) =>
            unoMerge(
              'text-13',
              s === 'selected' && 'text-coal font-semibold',
              s === 'today' && 'text-gold',
              s === 'normal' && (outside ? 'text-ghost' : 'text-dim'),
            ),
          )}
          label={`${date.day}`}
        />
      </box>
      <box
        $type="overlay"
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.END}
        visible={showDot}
        class="bg-gold mb-[3px] min-h-1 min-w-1 rounded-full"
      />
    </overlay>
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
        <label
          class={unoMerge(
            'text-11',
            index === 0 && 'text-holiday',
            index === 6 && 'text-saturday',
            index % 6 !== 0 && 'text-faint',
          )}
          label={weekday}
        />
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
