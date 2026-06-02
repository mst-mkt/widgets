import { createState } from 'ags'
import { execAsync, subprocess } from 'ags/process'
import GLib from 'gi://GLib'

import { run } from '../utils/exec'
import { clamp } from '../utils/math'

const DEBOUNCE_MS = 20

export const [brightness, setBrightnessState] = createState(0)

export const parseBrightness = (out: string) => {
  return clamp((Number.parseInt(out, 10) || 0) / 100, 0, 1)
}

const read = () => {
  return execAsync(['bash', '-c', "brightnessctl -m | cut -d, -f4 | tr -d '%'"])
    .then((out) => setBrightnessState(parseBrightness(out)))
    .catch(() => {})
}

export const setBrightness = (value: number) => {
  const next = clamp(value, 0, 1)
  setBrightnessState(next)
  void run(['brightnessctl', 'set', `${Math.round(next * 100)}%`])
}

export const initBrightness = () => {
  void read()

  const timer = { id: 0 }
  subprocess(
    ['bash', '-c', 'stdbuf -oL udevadm monitor --udev --subsystem-match=backlight'],
    () => {
      if (timer.id !== 0) GLib.source_remove(timer.id)

      timer.id = GLib.timeout_add(GLib.PRIORITY_DEFAULT, DEBOUNCE_MS, () => {
        void read()
        timer.id = 0
        return GLib.SOURCE_REMOVE
      })
    },
  )
}
