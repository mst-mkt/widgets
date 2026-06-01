import { vi } from 'vite-plus/test'

type Handler = () => void

type Source = {
  id: number
  appName: string
  summary: string
  body: string
  time: number
}

const state = {
  notifications: [] as Source[],
  handlers: {} as Record<string, Handler[]>,
}

const notifd = {
  get_notifications: () => state.notifications,
  connect: vi.fn((signal: string, cb: Handler) => {
    ;(state.handlers[signal] ??= []).push(cb)
    return 0
  }),
}

export const setMockNotifications = (list: Source[]) => {
  state.notifications = list
}

export const emit = (signal: string) => {
  for (const cb of state.handlers[signal] ?? []) {
    cb()
  }
}

export const reset = () => {
  state.notifications = []
  state.handlers = {}
}

export default {
  get_default: () => notifd,
}
