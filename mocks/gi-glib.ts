export const clock = { us: 0 }
export const timers: Array<() => boolean> = []

export const resetGLib = () => {
  clock.us = 0
  timers.length = 0
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
}
