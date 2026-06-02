import type { Accessor } from 'ags'
import { describe, expect, it, vi } from 'vite-plus/test'

import type { Workspace } from '../services/workspaces'

vi.mock('ags', () => import('../../test/mocks/ags'))

vi.mock('ags/process', () => import('../../test/mocks/ags-process'))

vi.mock('gi://GLib', () => import('../../test/mocks/gi-glib'))

const reactive = vi.hoisted(() => {
  return <T>(initial: T) => {
    const listeners = new Set<() => void>()
    let value = initial

    return {
      accessor: {
        peek: () => value,
        subscribe: (cb: () => void) => {
          listeners.add(cb)
          return () => listeners.delete(cb)
        },
      },
      set: (next: T) => {
        value = next
        for (const cb of listeners) cb()
      },
      reset: () => {
        value = initial
        listeners.clear()
      },
    }
  }
})

vi.mock('../services/audio', () => {
  const volume = reactive(0)
  const muted = reactive(false)
  return {
    volume: volume.accessor,
    isMuted: muted.accessor,
    setVolume: volume.set,
    setMuted: muted.set,
    __reset: () => {
      volume.reset()
      muted.reset()
    },
  }
})

vi.mock('../services/brightness', () => {
  const brightness = reactive(0)
  return {
    brightness: brightness.accessor,
    setBrightness: brightness.set,
    __reset: brightness.reset,
  }
})

type AudioMock = {
  volume: Accessor<number>
  isMuted: Accessor<boolean>
  setVolume: (value: number) => void
  setMuted: (value: boolean) => void
  __reset: () => void
}

type BrightnessMock = {
  brightness: Accessor<number>
  setBrightness: (value: number) => void
  __reset: () => void
}

const load = async () => {
  vi.resetModules()
  const glib = (await import('gi://GLib')) as unknown as typeof import('../../test/mocks/gi-glib')
  glib.resetGLib()
  const audio = (await import('../services/audio')) as unknown as AudioMock
  const brightness = (await import('../services/brightness')) as unknown as BrightnessMock
  audio.__reset()
  brightness.__reset()
  const workspaces = await import('../services/workspaces')
  const osd = await import('./osd')
  return { glib, audio, brightness, workspaces, osd }
}

const PAST_GRACE_US = 600 * 1000

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
  it('stays hidden for changes within the grace period', async () => {
    const { glib, audio, osd } = await load()
    osd.initOsd()

    audio.setVolume(0.6)

    expect(osd.visible.peek()).toBe(false)
    expect(glib.timers).toHaveLength(0)
  })

  it('shows the volume once the grace period has passed', async () => {
    const { glib, audio, osd } = await load()
    osd.initOsd()
    glib.clock.us = PAST_GRACE_US

    audio.setVolume(0.6)

    expect(osd.visible.peek()).toBe(true)
    expect(osd.content.peek()).toEqual({ icon: 'volume-2', value: 0.6 })
    expect(glib.timers).toHaveLength(1)
  })

  it('zeroes the bar when the speaker is muted', async () => {
    const { glib, audio, osd } = await load()
    osd.initOsd()
    audio.setVolume(0.6)
    glib.clock.us = PAST_GRACE_US

    audio.setMuted(true)

    expect(osd.content.peek()).toEqual({ icon: 'volume-x', value: 0 })
  })

  it('shows brightness changes with the sun icon', async () => {
    const { glib, brightness, osd } = await load()
    osd.initOsd()
    glib.clock.us = PAST_GRACE_US

    brightness.setBrightness(0.3)

    expect(osd.visible.peek()).toBe(true)
    expect(osd.content.peek()).toEqual({ icon: 'sun', value: 0.3 })
  })

  it('auto-hides after the hide delay fires', async () => {
    const { glib, audio, osd } = await load()
    osd.initOsd()
    glib.clock.us = PAST_GRACE_US
    audio.setVolume(0.6)

    expect(glib.timers[0]?.()).toBe(false)
    expect(osd.visible.peek()).toBe(false)
  })

  it('cancels the pending hide timer when re-shown', async () => {
    const { glib, audio, osd } = await load()
    osd.initOsd()
    glib.clock.us = PAST_GRACE_US

    audio.setVolume(0.6)
    audio.setVolume(0.7)

    expect(glib.removed).toEqual([1])
    expect(glib.timers).toHaveLength(2)
    expect(osd.content.peek()).toEqual({ icon: 'volume-2', value: 0.7 })
  })

  it('hides and cancels the timer when the focused workspace changes', async () => {
    const { glib, audio, workspaces, osd } = await load()
    workspaces.setWorkspaces(focusWorkspace(1))
    osd.initOsd()
    glib.clock.us = PAST_GRACE_US
    audio.setVolume(0.6)
    expect(osd.visible.peek()).toBe(true)

    workspaces.setWorkspaces(focusWorkspace(2))

    expect(osd.visible.peek()).toBe(false)
    expect(glib.removed).toEqual([1])
  })

  it('stays visible when focus re-emits the same workspace', async () => {
    const { glib, audio, workspaces, osd } = await load()
    workspaces.setWorkspaces(focusWorkspace(1))
    osd.initOsd()
    glib.clock.us = PAST_GRACE_US
    audio.setVolume(0.6)

    workspaces.setWorkspaces(focusWorkspace(1))

    expect(osd.visible.peek()).toBe(true)
  })
})
