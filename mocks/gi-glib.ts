export const clock = { us: 0 }
export const timers: (() => boolean)[] = []

export const resetGLib = () => {
  clock.us = 0
  timers.length = 0
}

const dateTime = {
  get_month: () => 6,
  get_day_of_month: () => 1,
  get_day_of_week: () => 2,
  get_hour: () => 12,
  get_minute: () => 0,
  get_second: () => 0,
}

export default {
  PRIORITY_DEFAULT: 0,
  SOURCE_CONTINUE: true,
  SOURCE_REMOVE: false,
  get_monotonic_time: () => clock.us,
  timeout_add: (_priority: number, _interval: number, fn: () => boolean) => {
    timers.push(fn)
    return timers.length
  },
  timeout_add_seconds: (_priority: number, _interval: number, fn: () => boolean) => {
    timers.push(fn)
    return timers.length
  },
  DateTime: {
    new_now_local: () => dateTime,
  },
}
