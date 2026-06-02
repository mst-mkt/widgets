import { createState } from 'ags'
import GLib from 'gi://GLib'

import type { IconName } from '../components/shared/icon'
import { isMuted, volume } from '../services/audio'
import { brightness } from '../services/brightness'
import { focused } from '../services/workspaces'

export type OsdContent = {
  icon: IconName
  value: number
}

const HIDE_DELAY = 1000
const GRACE_PERIOD = 500
const nowMs = () => GLib.get_monotonic_time() / 1000

export const [visible, setVisible] = createState(false)
export const [content, setContent] = createState<OsdContent>({ icon: 'volume-2', value: 0 })

const hideTimer = { id: 0 }

const clearTimer = () => {
  if (hideTimer.id !== 0) GLib.source_remove(hideTimer.id)
  hideTimer.id = 0
}

const hide = () => {
  clearTimer()
  setVisible(false)
}

const show = (next: OsdContent) => {
  setContent(next)
  setVisible(true)

  clearTimer()

  hideTimer.id = GLib.timeout_add(GLib.PRIORITY_DEFAULT, HIDE_DELAY, () => {
    setVisible(false)
    hideTimer.id = 0
    return GLib.SOURCE_REMOVE
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
  const startedAt = nowMs()
  const settled = () => nowMs() - startedAt > GRACE_PERIOD

  const showVolume = () => show(volumeContent(volume.peek(), isMuted.peek()))
  const showBrightness = () => show(brightnessContent(brightness.peek()))

  volume.subscribe(() => settled() && showVolume())
  isMuted.subscribe(() => settled() && showVolume())
  brightness.subscribe(() => settled() && showBrightness())

  let last = focused.peek()
  focused.subscribe(() => {
    if (focused.peek() === last) return
    last = focused.peek()
    hide()
  })
}
