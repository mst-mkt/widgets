import { describe, expect, it, vi } from 'vite-plus/test'

import type { Workspace } from '../services/workspaces'

vi.mock('ags', () => import('../../test/mocks/ags'))

vi.mock('ags/process', () => import('../../test/mocks/ags-process'))

const mocks = await vi.hoisted(async () => {
  const { reactive } = await import('../../test/mocks/reactive')
  const glib = await import('../../test/mocks/gi-glib')
  const time = await import('../../test/mocks/ags-time')

  const volume = reactive(0)
  const muted = reactive(false)
  const brightness = reactive(0)

  return {
    glib,
    time,
    audio: {
      volume: volume.accessor,
      isMuted: muted.accessor,
      setVolume: volume.set,
      setMuted: muted.set,
      __reset: () => {
        volume.reset()
        muted.reset()
      },
    },
    brightness: {
      brightness: brightness.accessor,
      setBrightness: brightness.set,
      __reset: brightness.reset,
    },
  }
})

vi.mock('ags/time', () => mocks.time)

vi.mock('gi://GLib', () => mocks.glib)

vi.mock('../services/audio', () => mocks.audio)

vi.mock('../services/brightness', () => mocks.brightness)

const load = async () => {
  vi.resetModules()
  mocks.glib.resetGLib()
  mocks.time.resetTime()
  mocks.audio.__reset()
  mocks.brightness.__reset()
  const workspaces = await import('../services/workspaces')
  const osd = await import('./osd')
  return {
    glib: mocks.glib,
    time: mocks.time,
    audio: mocks.audio,
    brightness: mocks.brightness,
    workspaces,
    osd,
  }
}

const focusWorkspace = (idx: number): Workspace[] => [{ id: idx, idx, is_focused: true }]

const { volumeIcon, volumeContent, brightnessContent } = await import('./osd')

describe('volumeIcon', () => {
  it('is muted whenever muted or at zero', () => {
    expect(volumeIcon(0.8, true)).toBe('volume-x')
    expect(volumeIcon(0, false)).toBe('volume-x')
  })

  it('steps from low to high by level', () => {
    expect(volumeIcon(0.3, false)).toBe('volume-1')
    expect(volumeIcon(0.5, false)).toBe('volume-2')
    expect(volumeIcon(0.9, false)).toBe('volume-2')
  })
})

describe('volumeContent', () => {
  it('keeps the current level when unmuted', () => {
    expect(volumeContent(0.6, false)).toEqual({ icon: 'volume-2', value: 0.6 })
  })

  it('empties the bar and shows the muted icon when muted', () => {
    expect(volumeContent(0.6, true)).toEqual({ icon: 'volume-x', value: 0 })
  })
})

describe('brightnessContent', () => {
  it('uses the sun icon and the raw level', () => {
    expect(brightnessContent(0.4)).toEqual({ icon: 'sun', value: 0.4 })
  })
})

describe('initOsd', () => {
  it('stays hidden while volume settles to its initial value', async () => {
    const { audio, osd } = await load()
    osd.initOsd()

    audio.setVolume(0.6)

    expect(osd.visible.peek()).toBe(false)
  })

  it('shows the volume when it changes', async () => {
    const { time, audio, osd } = await load()
    osd.initOsd()
    audio.setVolume(0.5)

    audio.setVolume(0.6)

    expect(osd.visible.peek()).toBe(true)
    expect(osd.content.peek()).toEqual({ icon: 'volume-2', value: 0.6 })
    expect(time.timers).toHaveLength(1)
  })

  it('zeroes the bar when the speaker is muted', async () => {
    const { audio, osd } = await load()
    osd.initOsd()
    audio.setVolume(0.6)

    audio.setMuted(true)

    expect(osd.content.peek()).toEqual({ icon: 'volume-x', value: 0 })
  })

  it('stays hidden while brightness settles to its initial value', async () => {
    const { brightness, osd } = await load()
    osd.initOsd()

    brightness.setBrightness(0.3)

    expect(osd.visible.peek()).toBe(false)
  })

  it('shows brightness changes with the sun icon', async () => {
    const { brightness, osd } = await load()
    osd.initOsd()
    brightness.setBrightness(0.3)

    brightness.setBrightness(0.4)

    expect(osd.visible.peek()).toBe(true)
    expect(osd.content.peek()).toEqual({ icon: 'sun', value: 0.4 })
  })

  it('auto-hides after the hide delay fires', async () => {
    const { time, audio, osd } = await load()
    osd.initOsd()
    audio.setVolume(0.5)
    audio.setVolume(0.6)

    time.timers[0]?.()

    expect(osd.visible.peek()).toBe(false)
  })

  it('cancels the pending hide timer when re-shown', async () => {
    const { time, audio, osd } = await load()
    osd.initOsd()
    audio.setVolume(0.5)

    audio.setVolume(0.6)
    audio.setVolume(0.7)

    expect(time.cancelled).toEqual([1])
    expect(time.timers).toHaveLength(2)
    expect(osd.content.peek()).toEqual({ icon: 'volume-2', value: 0.7 })
  })

  it('hides and cancels the timer when the focused workspace changes', async () => {
    const { time, audio, workspaces, osd } = await load()
    workspaces.setWorkspaces(focusWorkspace(1))
    osd.initOsd()
    audio.setVolume(0.5)
    audio.setVolume(0.6)
    expect(osd.visible.peek()).toBe(true)

    workspaces.setWorkspaces(focusWorkspace(2))

    expect(osd.visible.peek()).toBe(false)
    expect(time.cancelled).toEqual([1])
  })

  it('stays visible when focus re-emits the same workspace', async () => {
    const { audio, workspaces, osd } = await load()
    workspaces.setWorkspaces(focusWorkspace(1))
    osd.initOsd()
    audio.setVolume(0.5)
    audio.setVolume(0.6)

    workspaces.setWorkspaces(focusWorkspace(1))

    expect(osd.visible.peek()).toBe(true)
  })
})
