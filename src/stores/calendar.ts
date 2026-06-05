import { createComputed, createState } from 'ags'

import {
  eventsStatus,
  events,
  eventsOnDay,
  fetchEvents,
  type CalendarEvent,
} from '../services/calendar'
import { currentDay } from '../services/clock'
import { holidayKeys } from '../services/holidays'
import { addMonths, dayKey, type CalDate, type YearMonth } from '../utils/calendar'
import { isPanelOpen } from './panel'

const initial = currentDay.peek()

export const [viewMonth, setViewMonth] = createState<YearMonth>({
  year: initial.year,
  month: initial.month,
})

export const [selectedDate, setSelectedDate] = createState<CalDate>(initial)

export const todayDate = currentDay

export const eventDays = events.as((list) => new Set(list.map((event) => dayKey(event.day))))

export const holidayDays = viewMonth.as(holidayKeys)

export type EventsView =
  | { kind: 'error' }
  | { kind: 'empty' }
  | { kind: 'list'; events: CalendarEvent[] }

export const eventsView = createComputed((): EventsView => {
  if (eventsStatus() === 'error') return { kind: 'error' }
  const list = eventsOnDay(events(), selectedDate())
  return list.length === 0 ? { kind: 'empty' } : { kind: 'list', events: list }
})

export const prevMonth = () => setViewMonth((month) => addMonths(month, -1))
export const nextMonth = () => setViewMonth((month) => addMonths(month, 1))

export const selectDay = (date: CalDate) => setSelectedDate(date)

export const goToday = () => {
  const now = currentDay.peek()
  setViewMonth({ year: now.year, month: now.month })
  setSelectedDate(now)
}

export const initCalendar = () => {
  const open = isPanelOpen('calendar')

  viewMonth.subscribe(() => void fetchEvents(viewMonth.peek()))

  open.subscribe(() => {
    if (open.peek()) goToday()
  })
}
