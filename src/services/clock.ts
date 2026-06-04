import { createState } from 'ags'
import { timeout } from 'ags/time'
import GLib from 'gi://GLib'

const WEEKDAYS = ['月', '火', '水', '木', '金', '土', '日']

export const weekdayLabel = (weekday: number) => {
  return WEEKDAYS[weekday - 1] ?? ''
}

type DateParts = {
  month: number
  day: number
  weekday: number
}

export const formatDate = ({ month, day, weekday }: DateParts) => {
  return `${month}月${day}日 (${weekdayLabel(weekday)})`
}

type TimeParts = {
  hour: number
  minute: number
  second: number
}

export const secondsUntilMidnight = (time: TimeParts) => {
  const oneMinute = 60
  const oneHour = oneMinute * 60
  const dayInSeconds = oneHour * 24
  return dayInSeconds - (time.hour * oneHour + time.minute * oneMinute + time.second)
}

const now = () => GLib.DateTime.new_now_local()

const dateOf = (dt: GLib.DateTime) => {
  return formatDate({
    month: dt.get_month(),
    day: dt.get_day_of_month(),
    weekday: dt.get_day_of_week(),
  })
}

export const [today, setToday] = createState(dateOf(now()))

export const initClock = () => {
  const tick = () => {
    const current = now()
    setToday(dateOf(current))

    const secondsLeft =
      secondsUntilMidnight({
        hour: current.get_hour(),
        minute: current.get_minute(),
        second: current.get_second(),
      }) + 1

    timeout(secondsLeft * 1000, tick)
  }

  tick()
}
