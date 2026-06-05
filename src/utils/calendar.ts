export type CalDate = {
  year: number
  month: number
  day: number
}

export type YearMonth = {
  year: number
  month: number
}

export const daysInMonth = (year: number, month: number) => {
  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}

export const weekdayOf = ({ year, month, day }: CalDate) => {
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay()
}

export const isSameDay = (a: CalDate, b: CalDate) => {
  return a.year === b.year && a.month === b.month && a.day === b.day
}

export const monthMatrix = (year: number, month: number): (CalDate | null)[][] => {
  const leading = weekdayOf({ year, month, day: 1 })
  const total = daysInMonth(year, month)
  const cells: (CalDate | null)[] = []

  for (let i = 0; i < leading; i++) cells.push(null)
  for (let day = 1; day <= total; day++) cells.push({ year, month, day })
  while (cells.length % 7 !== 0) cells.push(null)

  const weeks: (CalDate | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}
