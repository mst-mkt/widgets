import { describe, expect, it, vi } from 'vite-plus/test'

import type { Workspace } from '../services/workspaces'

vi.mock('ags', () => import('../../test/mocks/ags'))

vi.mock('ags/process', () => import('../../test/mocks/ags-process'))

const focusWorkspace = (idx: number): Workspace[] => [{ id: idx, idx, is_focused: true }]

const load = async () => {
  vi.resetModules()
  const workspaces = await import('../services/workspaces')
  const panel = await import('./panel')
  return { ...workspaces, ...panel }
}

describe('togglePanel', () => {
  it('opens the panel, then closes it on the second call', async () => {
    const { isPanelOpen, togglePanel } = await load()
    const open = isPanelOpen('notification')

    expect(open.peek()).toBe(false)
    togglePanel('notification')
    expect(open.peek()).toBe(true)
    togglePanel('notification')
    expect(open.peek()).toBe(false)
  })
})

describe('isPanelOpen', () => {
  it('is true only for the panel that is currently open', async () => {
    const { isPanelOpen, openPanel, closePanel } = await load()
    const open = isPanelOpen('notification')

    openPanel('notification')
    expect(open.peek()).toBe(true)

    closePanel()
    expect(open.peek()).toBe(false)
  })
})

describe('initPanel', () => {
  it('closes the open panel when the focused workspace changes', async () => {
    const { setWorkspaces, initPanel, isPanelOpen, openPanel } = await load()
    const open = isPanelOpen('notification')
    setWorkspaces(focusWorkspace(1))
    initPanel()
    openPanel('notification')

    setWorkspaces(focusWorkspace(2))

    expect(open.peek()).toBe(false)
  })

  it('keeps the panel open when focus re-emits the same workspace', async () => {
    const { setWorkspaces, initPanel, isPanelOpen, openPanel } = await load()
    const open = isPanelOpen('notification')
    setWorkspaces(focusWorkspace(1))
    initPanel()
    openPanel('notification')

    setWorkspaces(focusWorkspace(1))

    expect(open.peek()).toBe(true)
  })
})
