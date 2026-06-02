import { createBinding, createState, type Accessor } from 'ags'
import AstalWp from 'gi://AstalWp'

import { clamp } from '../utils/math'

const wireplumber = AstalWp.get_default()
const speaker = wireplumber?.audio?.defaultSpeaker ?? null

export const volume: Accessor<number> =
  speaker !== null ? createBinding(speaker, 'volume') : createState(0)[0]

export const isMuted: Accessor<boolean> =
  speaker !== null ? createBinding(speaker, 'mute') : createState(false)[0]

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
