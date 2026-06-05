import { createState } from 'ags'
import GLib from 'gi://GLib'

import { time } from '../services/clock'
import type { CalDate, YearMonth } from '../utils/calendar'

const currentDate = (): CalDate => {
  const dt = GLib.DateTime.new_now_local()
  return { year: dt.get_year(), month: dt.get_month(), day: dt.get_day_of_month() }
}

const initial = currentDate()

export const [viewMonth, setViewMonth] = createState<YearMonth>({
  year: initial.year,
  month: initial.month,
})

export const todayDate = time.as(
  (parts): CalDate => ({ year: parts.year, month: parts.month, day: parts.day }),
)
