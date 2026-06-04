import { Accessor, createBinding } from 'ags'
import AstalWp from 'gi://AstalWp'

import { clamp } from '../utils/math'

let speaker: AstalWp.Endpoint | null = null
let volumeBinding: Accessor<number> | null = null
let mutedBinding: Accessor<boolean> | null = null

export const volume = new Accessor(
  () => volumeBinding?.peek() ?? 0,
  (callback) => volumeBinding?.subscribe(callback) ?? (() => {}),
)

export const isMuted = new Accessor(
  () => mutedBinding?.peek() ?? false,
  (callback) => mutedBinding?.subscribe(callback) ?? (() => {}),
)

export const setVolume = (value: number) => {
  if (speaker !== null) {
    speaker.volume = clamp(value, 0, 1)
  }
}

export const toggleMute = () => {
  if (speaker !== null) {
    speaker.mute = !speaker.mute
  }
}

export const initAudio = () => {
  speaker = AstalWp.get_default()?.audio?.defaultSpeaker ?? null
  if (speaker === null) return

  volumeBinding = createBinding(speaker, 'volume')
  mutedBinding = createBinding(speaker, 'mute')
}
