import { vi } from 'vite-plus/test'

type Handler = () => void

type Source = {
  id: number
  appName: string
  appIcon: string
  desktopEntry: string
  summary: string
  body: string
  image: string
  urgency: number
  time: number
  actions: { id: string; label: string }[]
}

type Store = {
  notifications: Source[]
  handlers: Record<string, Handler[]>
  invoked: [id: number, actionId: string][]
}

const state: Store = {
  notifications: [],
  handlers: {},
  invoked: [],
}

const notifd = {
  get_notifications: () => state.notifications,
  get_notification: (id: number) => {
    if (!state.notifications.some((n) => n.id === id)) return null
    return {
      invoke: (actionId: string) => state.invoked.push([id, actionId]),
      dismiss: () => {},
    }
  },
  connect: vi.fn((signal: string, cb: Handler) => {
    state.handlers[signal] ??= []
    state.handlers[signal].push(cb)
    return 0
  }),
}

export const invocations = () => state.invoked

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
  state.invoked = []
}

export default {
  get_default: () => notifd,
}
