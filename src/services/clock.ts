import { createState } from 'ags'
import { timeout } from 'ags/time'
import GLib from 'gi://GLib'

import { isSameDay, type CalDate } from '../utils/calendar'
import { formatDate, type ClockParts } from '../utils/format'

const now = () => GLib.DateTime.new_now_local()

const dateOf = (dt: GLib.DateTime) => {
  return formatDate({
    month: dt.get_month(),
    day: dt.get_day_of_month(),
    weekday: dt.get_day_of_week(),
  })
}

const dayOf = (dt: GLib.DateTime): CalDate => ({
  year: dt.get_year(),
  month: dt.get_month(),
  day: dt.get_day_of_month(),
})

const partsOf = (dt: GLib.DateTime): ClockParts => ({
  year: dt.get_year(),
  month: dt.get_month(),
  day: dt.get_day_of_month(),
  hour: dt.get_hour(),
  minute: dt.get_minute(),
  second: dt.get_second(),
})

export const [today, setToday] = createState(dateOf(now()))
export const [time, setTime] = createState(partsOf(now()))
export const [currentDay, setCurrentDay] = createState(dayOf(now()))

export const initClock = () => {
  const tick = () => {
    const current = now()
    setTime(partsOf(current))

    const date = dateOf(current)
    if (date !== today.peek()) setToday(date)

    const day = dayOf(current)
    if (!isSameDay(day, currentDay.peek())) setCurrentDay(day)

    timeout(1000, tick)
  }

  tick()
}
