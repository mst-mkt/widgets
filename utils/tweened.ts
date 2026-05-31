import { createState, type Accessor } from 'ags'
import GLib from 'gi://GLib'

import { easeOutCubic, lerp } from './math'

type TweenOptions = {
  duration?: number
  easing?: (t: number) => number
}

const FRAME_MS = 16
const nowMs = () => GLib.get_monotonic_time() / 1000

export const tweened = (
  source: Accessor<number>,
  { duration = 300, easing = easeOutCubic }: TweenOptions = {},
): Accessor<number> => {
  const [value, setValue] = createState(source.get())

  let from = value.get()
  let to = from
  let startedAt = 0
  let isRunning = false

  const tick = () => {
    const progress = Math.min((nowMs() - startedAt) / duration, 1)
    setValue(lerp(from, to, easing(progress)))
    isRunning = progress < 1
    return isRunning ? GLib.SOURCE_CONTINUE : GLib.SOURCE_REMOVE
  }

  source.subscribe(() => {
    const next = source.get()
    if (next === to) return

    from = value.get()
    to = next
    startedAt = nowMs()

    if (isRunning) return
    isRunning = true
    GLib.timeout_add(GLib.PRIORITY_DEFAULT, FRAME_MS, tick)
  })

  return value
}
