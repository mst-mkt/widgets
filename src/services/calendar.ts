import { createState } from 'ags'
import { execAsync } from 'ags/process'

import { addMonths, isSameDay, type CalDate, type YearMonth } from '../utils/calendar'
import { pad2 } from '../utils/format'

export type CalendarEvent = {
  summary: string
  start: string
  end: string
  allDay: boolean
  day: CalDate
}

type EventTime = {
  dateTime?: string
  date?: string
}

type RawEvent = {
  summary?: string
  start?: EventTime
  end?: EventTime
}

const dayFromIso = (iso: string): CalDate => {
  const [year, month, day] = iso.slice(0, 10).split('-').map(Number)
  return { year: year || 0, month: month || 1, day: day || 1 }
}

export const toEvent = (raw: RawEvent): CalendarEvent => {
  const allDay = raw.start?.dateTime === undefined
  const start = raw.start?.dateTime ?? raw.start?.date ?? ''
  const end = raw.end?.dateTime ?? raw.end?.date ?? ''

  return { summary: raw.summary ?? '', start, end, allDay, day: dayFromIso(start) }
}

export const parseEvents = (raw: string): CalendarEvent[] => {
  try {
    const parsed: { items?: RawEvent[] } = JSON.parse(raw)
    return Array.isArray(parsed.items) ? parsed.items.map(toEvent) : []
  } catch {
    return []
  }
}

export const eventsOnDay = (events: CalendarEvent[], date: CalDate) => {
  return events
    .filter((event) => isSameDay(event.day, date))
    .toSorted((a, b) => {
      if (a.allDay !== b.allDay) return a.allDay ? -1 : 1
      return a.start.localeCompare(b.start)
    })
}

const monthBounds = ({ year, month }: YearMonth) => {
  const next = addMonths({ year, month }, 1)
  return {
    timeMin: `${year}-${pad2(month)}-01T00:00:00Z`,
    timeMax: `${next.year}-${pad2(next.month)}-01T00:00:00Z`,
  }
}

export const buildListCommand = (month: YearMonth) => {
  const { timeMin, timeMax } = monthBounds(month)
  const params = JSON.stringify({
    calendarId: 'primary',
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: 'startTime',
  })
  return ['gws', 'calendar', 'events', 'list', '--format', 'json', '--params', params]
}

export type EventsStatus = 'ready' | 'error'

export const [events, setEvents] = createState<CalendarEvent[]>([])
export const [eventsStatus, setEventsStatus] = createState<EventsStatus>('ready')

let pending = 0

export const fetchEvents = (month: YearMonth) => {
  const ticket = ++pending
  return execAsync(buildListCommand(month))
    .then((raw: string) => {
      if (ticket !== pending) return
      setEvents(parseEvents(raw))
      setEventsStatus('ready')
    })
    .catch(() => {
      if (ticket !== pending) return
      setEvents([])
      setEventsStatus('error')
    })
}
