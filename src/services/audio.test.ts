import { describe, expect, it, vi } from 'vite-plus/test'

vi.mock('ags', () => import('../../test/mocks/ags'))

type Speaker = { volume: number; mute: boolean }

const load = async (speaker: Speaker | null) => {
  vi.resetModules()
  vi.doMock('gi://AstalWp', () => ({
    default: {
      get_default: () => (speaker === null ? null : { audio: { defaultSpeaker: speaker } }),
    },
  }))
  return await import('./audio')
}

describe('volume and isMuted', () => {
  it('reflect the speaker state', async () => {
    const { volume, isMuted } = await load({ volume: 0.4, mute: true })

    expect(volume.peek()).toBe(0.4)
    expect(isMuted.peek()).toBe(true)
  })

  it('fall back to silent defaults when no speaker is available', async () => {
    const { volume, isMuted } = await load(null)

    expect(volume.peek()).toBe(0)
    expect(isMuted.peek()).toBe(false)
  })
})

describe('setVolume', () => {
  it('passes through values within range', async () => {
    const speaker: Speaker = { volume: 0, mute: false }
    const { setVolume } = await load(speaker)

    setVolume(0.5)

    expect(speaker.volume).toBe(0.5)
  })

  it('clamps values outside the 0-1 range', async () => {
    const speaker: Speaker = { volume: 0, mute: false }
    const { setVolume } = await load(speaker)

    setVolume(1.5)
    expect(speaker.volume).toBe(1)

    setVolume(-1)
    expect(speaker.volume).toBe(0)
  })

  it('is a no-op when no speaker is available', async () => {
    const { setVolume } = await load(null)

    expect(() => setVolume(0.5)).not.toThrow()
  })
})

describe('toggleMute', () => {
  it('flips the speaker mute state', async () => {
    const speaker: Speaker = { volume: 0.5, mute: false }
    const { toggleMute } = await load(speaker)

    toggleMute()
    expect(speaker.mute).toBe(true)

    toggleMute()
    expect(speaker.mute).toBe(false)
  })

  it('is a no-op when no speaker is available', async () => {
    const { toggleMute } = await load(null)

    expect(() => toggleMute()).not.toThrow()
  })
})
