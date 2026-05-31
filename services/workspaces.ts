import { createState } from 'ags'
import { subprocess } from 'ags/process'

import { run } from '../utils/exec'

export type Workspace = {
  id: number
  idx: number
  is_focused: boolean
}

type NiriEvent = {
  WorkspacesChanged?: { workspaces: Workspace[] }
  WorkspaceActivated?: { id: number; focused: boolean }
}

export const parseEvent = (line: string): NiriEvent | null => {
  try {
    return JSON.parse(line)
  } catch {
    return null
  }
}

export const sortWorkspaces = (workspaces: Workspace[]) => {
  return workspaces.toSorted((a, b) => a.idx - b.idx)
}

export const markFocused = (workspaces: Workspace[], match: (workspace: Workspace) => boolean) => {
  return workspaces.map((workspace) => ({ ...workspace, is_focused: match(workspace) }))
}

export const focusedIdx = (workspaces: Workspace[]) => {
  const focusedWorkspace = workspaces.find((workspace) => workspace.is_focused)
  return focusedWorkspace?.idx ?? -1
}

export const [workspaces, setWorkspaces] = createState<Workspace[]>([])

export const focused = workspaces.as(focusedIdx)

const setFocused = (match: (workspace: Workspace) => boolean) => {
  return setWorkspaces((prev) => markFocused(prev, match))
}

export const initWorkspaces = () => {
  subprocess(['niri', 'msg', '--json', 'event-stream'], (line) => {
    const event = parseEvent(line)
    if (event === null) return

    if (event.WorkspacesChanged) {
      setWorkspaces(sortWorkspaces(event.WorkspacesChanged.workspaces))
    } else if (event.WorkspaceActivated?.focused) {
      const { id } = event.WorkspaceActivated
      setFocused((workspace) => workspace.id === id)
    }
  })
}

export const focus = (idx: number) => {
  setFocused((workspace) => workspace.idx === idx)
  void run(['niri', 'msg', 'action', 'focus-workspace', `${idx}`])
}
