import { createState } from 'ags'

import { currentDay } from '../services/clock'
import { addMonths, type CalDate, type YearMonth } from '../utils/calendar'
import { isPanelOpen } from './panel'

const initial = currentDay.peek()

export const [viewMonth, setViewMonth] = createState<YearMonth>({
  year: initial.year,
  month: initial.month,
})

export const [selectedDate, setSelectedDate] = createState<CalDate>(initial)

export const todayDate = currentDay

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

  open.subscribe(() => {
    if (open.peek()) goToday()
  })
}
