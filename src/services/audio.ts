import { createBinding, createState } from 'ags'
import AstalWp from 'gi://AstalWp'

import { clamp } from '../utils/math'

export const [volume, setVolumeState] = createState(0)
export const [isMuted, setMutedState] = createState(false)

let speaker: AstalWp.Endpoint | null = null

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

  const volumeBinding = createBinding(speaker, 'volume')
  const mutedBinding = createBinding(speaker, 'mute')

  setVolumeState(volumeBinding.peek())
  setMutedState(mutedBinding.peek())

  volumeBinding.subscribe(() => setVolumeState(volumeBinding.peek()))
  mutedBinding.subscribe(() => setMutedState(mutedBinding.peek()))
}
