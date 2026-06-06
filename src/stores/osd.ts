import { createState } from 'ags'
import { type Timer, timeout } from 'ags/time'

import type { IconName } from '../components/shared/icon'
import { isMuted, volume } from '../services/audio'
import { brightness } from '../services/brightness'
import { focused } from '../services/workspaces'

export type OsdContent = {
  icon: IconName
  value: number
}

const HIDE_DELAY = 1000

export const [visible, setVisible] = createState(false)
export const [content, setContent] = createState<OsdContent>({ icon: 'volume-2', value: 0 })

let hideTimer: Timer | null = null

const clearTimer = () => {
  hideTimer?.cancel()
  hideTimer = null
}

const hide = () => {
  clearTimer()
  setVisible(false)
}

const show = (next: OsdContent) => {
  setContent(next)
  setVisible(true)

  clearTimer()

  hideTimer = timeout(HIDE_DELAY, () => {
    setVisible(false)
    hideTimer = null
  })
}

export const volumeIcon = (value: number, muted: boolean): IconName => {
  if (muted || value <= 0) return 'volume-x'
  if (value < 0.5) return 'volume-1'
  return 'volume-2'
}

export const volumeContent = (value: number, muted: boolean): OsdContent => ({
  icon: volumeIcon(value, muted),
  value: muted ? 0 : value,
})

export const brightnessContent = (value: number): OsdContent => ({
  icon: 'sun',
  value,
})

export const initOsd = () => {
  let volumeReady = false
  let lastVolume = volume.peek()
  let lastMuted = isMuted.peek()

  const onVolume = () => {
    const value = volume.peek()
    const muted = isMuted.peek()
    if (!volumeReady) {
      volumeReady = true
      lastVolume = value
      lastMuted = muted
      return
    }

    if (value === lastVolume && muted === lastMuted) return

    lastVolume = value
    lastMuted = muted
    show(volumeContent(value, muted))
  }
  volume.subscribe(onVolume)
  isMuted.subscribe(onVolume)

  let brightnessReady = false
  let lastBrightness = brightness.peek()

  brightness.subscribe(() => {
    const value = brightness.peek()
    if (!brightnessReady) {
      brightnessReady = true
      lastBrightness = value
      return
    }

    if (value === lastBrightness) return
    lastBrightness = value
    show(brightnessContent(value))
  })

  let lastFocused = focused.peek()

  focused.subscribe(() => {
    if (focused.peek() === lastFocused) return

    lastFocused = focused.peek()
    hide()
  })
}
