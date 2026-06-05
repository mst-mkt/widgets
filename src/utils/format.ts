import type { CalDate, YearMonth } from './calendar'

const pad2 = (value: number) => `${value}`.padStart(2, '0')

const WEEKDAYS = ['月', '火', '水', '木', '金', '土', '日']

const weekdayLabel = (weekday: number) => WEEKDAYS[weekday - 1] ?? ''

type DateParts = {
  month: number
  day: number
  weekday: number
}

export const formatDate = ({ month, day, weekday }: DateParts) => {
  return `${month}月${day}日 (${weekdayLabel(weekday)})`
}

export type ClockParts = {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

export const formatClock = ({ year, month, day, hour, minute, second }: ClockParts) => {
  return `${year}.${pad2(month)}.${pad2(day)} ${pad2(hour)}:${pad2(minute)}:${pad2(second)}`
}

export const formatYearMonth = ({ year, month }: YearMonth) => {
  return `${year}年${month}月`
}

export const formatYearMonthDay = ({ year, month, day }: CalDate) => {
  return `${year}年${month}月${day}日`
}
