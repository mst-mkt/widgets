export type CalDate = {
  year: number
  month: number
  day: number
}

export type YearMonth = {
  year: number
  month: number
}

export const weekdayOf = ({ year, month, day }: CalDate) => {
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay()
}

export const isSameDay = (a: CalDate, b: CalDate) => {
  return a.year === b.year && a.month === b.month && a.day === b.day
}

export const isSameMonth = (date: CalDate, { year, month }: YearMonth) => {
  return date.year === year && date.month === month
}

export const addMonths = ({ year, month }: YearMonth, delta: number): YearMonth => {
  const total = year * 12 + (month - 1) + delta
  return { year: Math.floor(total / 12), month: (((total % 12) + 12) % 12) + 1 }
}

const WEEKS = 6

const dateAt = (year: number, month: number, offset: number): CalDate => {
  const date = new Date(Date.UTC(year, month - 1, 1 + offset))
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() }
}

export const monthMatrix = (year: number, month: number): CalDate[][] => {
  const leading = weekdayOf({ year, month, day: 1 })

  return [...Array(WEEKS)].map((_, week) =>
    [...Array(7)].map((_, weekday) => dateAt(year, month, week * 7 + weekday - leading)),
  )
}
