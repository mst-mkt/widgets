import { describe, expect, it, vi } from 'vite-plus/test'

import { focusedIdx, markFocused, parseEvent, sortWorkspaces, type Workspace } from './workspaces'

vi.mock('ags', () => import('../../test/mocks/ags'))

vi.mock('ags/process', () => import('../../test/mocks/ags-process'))

const createWorkspace = (id: number, idx: number, is_focused = false): Workspace => ({
  id,
  idx,
  is_focused,
})

describe('parseEvent', () => {
  it('parses a WorkspacesChanged event', () => {
    const event = parseEvent('{"WorkspacesChanged":{"workspaces":[]}}')

    expect(event?.WorkspacesChanged?.workspaces).toEqual([])
  })

  it('parses a WorkspaceActivated event', () => {
    const event = parseEvent('{"WorkspaceActivated":{"id":3,"focused":true}}')

    expect(event?.WorkspaceActivated).toEqual({ id: 3, focused: true })
  })

  it('returns null on non-JSON or empty lines', () => {
    expect(parseEvent('not json')).toBeNull()
    expect(parseEvent('')).toBeNull()
  })
})

describe('sortWorkspaces', () => {
  it('sorts by idx ascending', () => {
    const workspaces = [createWorkspace(13, 5), createWorkspace(4, 4), createWorkspace(2, 2)]

    const sorted = sortWorkspaces(workspaces)

    expect(sorted.map((w) => w.idx)).toEqual([2, 4, 5])
  })

  it('does not mutate the input', () => {
    const input = [createWorkspace(1, 2), createWorkspace(2, 1)]

    sortWorkspaces(input)

    expect(input.map((w) => w.idx)).toEqual([2, 1])
  })
})

describe('markFocused', () => {
  it('focuses the workspace matched by id (event-stream path)', () => {
    const workspaces = [createWorkspace(13, 5), createWorkspace(4, 4, true)]

    const next = markFocused(workspaces, (w) => w.id === 13)

    expect(next.map((w) => w.is_focused)).toEqual([true, false])
  })

  it('focuses by idx, not id (the focus() click path)', () => {
    const workspaces = [createWorkspace(13, 5), createWorkspace(4, 4)]

    const next = markFocused(workspaces, (w) => w.idx === 5)

    expect(next.find((w) => w.is_focused)?.id).toBe(13)
  })

  it('clears focus when nothing matches', () => {
    const workspaces = [createWorkspace(1, 1, true)]

    const next = markFocused(workspaces, () => false)

    expect(next.every((w) => !w.is_focused)).toBe(true)
  })

  it('does not mutate the input', () => {
    const input = [createWorkspace(1, 1)]

    markFocused(input, () => true)

    expect(input[0]?.is_focused).toBe(false)
  })
})

describe('focusedIdx', () => {
  it('returns the idx of the focused workspace', () => {
    const workspaces = [createWorkspace(13, 5), createWorkspace(4, 4, true)]

    const idx = focusedIdx(workspaces)

    expect(idx).toBe(4)
  })

  it('returns -1 when nothing is focused or the list is empty', () => {
    expect(focusedIdx([createWorkspace(1, 1)])).toBe(-1)
    expect(focusedIdx([])).toBe(-1)
  })
})
