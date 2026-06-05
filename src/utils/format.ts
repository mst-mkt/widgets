const pad2 = (value: number) => `${value}`.padStart(2, '0')

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
