import { describe, expect, it, vi } from 'vite-plus/test'

import type { Notification } from '../services/notifications'
import type { Toast } from './toast'

vi.mock('ags', () => import('../../test/mocks/ags'))

const mocks = await vi.hoisted(async () => {
  const { reactive } = await import('../../test/mocks/reactive')
  const time = await import('../../test/mocks/ags-time')
  const { vi: vitest } = await import('vite-plus/test')

  const notifications = reactive<Notification[]>([])
  const activate = vitest.fn()

  return { time, notifications, activate }
})

vi.mock('ags/time', () => mocks.time)

vi.mock('../services/notifications', () => ({
  notifications: mocks.notifications.accessor,
  activate: mocks.activate,
}))

const notify = (id: number, overrides: Partial<Notification> = {}): Notification => ({
  id,
  appName: 'App',
  appIcon: '',
  desktopEntry: '',
  summary: 'summary',
  body: 'body',
  image: '',
  urgency: 1,
  time: 0,
  actions: [],
  ...overrides,
})

const visible = (list: Toast[]) => list.map((toast) => ({ id: toast.id, leaving: toast.leaving }))

const load = async () => {
  vi.resetModules()
  mocks.time.resetTime()
  mocks.notifications.reset()
  mocks.activate.mockClear()
  const toast = await import('./toast')
  return { time: mocks.time, notifications: mocks.notifications, activate: mocks.activate, toast }
}

describe('initToast', () => {
  it('does not toast notifications that exist at startup', async () => {
    const { toast, notifications } = await load()
    notifications.set([notify(1), notify(2)])

    toast.initToast()

    expect(toast.toasts.peek()).toEqual([])
  })

  it('toasts a newly arriving notification and schedules its dismissal', async () => {
    const { toast, notifications, time } = await load()
    toast.initToast()

    notifications.set([notify(1)])

    expect(visible(toast.toasts.peek())).toEqual([{ id: 1, leaving: false }])
    expect(time.timers).toHaveLength(1)
  })

  it('marks a resolved notification as leaving, then removes it after the exit delay', async () => {
    const { toast, notifications, time } = await load()
    toast.initToast()
    notifications.set([notify(1)])

    notifications.set([])

    expect(visible(toast.toasts.peek())).toEqual([{ id: 1, leaving: true }])

    time.timers.at(-1)?.()

    expect(toast.toasts.peek()).toEqual([])
  })

  it('revives a leaving toast when the same notification reappears before it is removed', async () => {
    const { toast, notifications } = await load()
    toast.initToast()
    notifications.set([notify(1)])
    notifications.set([])

    expect(visible(toast.toasts.peek())).toEqual([{ id: 1, leaving: true }])

    notifications.set([notify(1)])

    expect(visible(toast.toasts.peek())).toEqual([{ id: 1, leaving: false }])
  })

  it('does not auto-dismiss critical notifications', async () => {
    const { toast, notifications, time } = await load()
    toast.initToast()

    notifications.set([notify(1, { urgency: 2 })])

    expect(visible(toast.toasts.peek())).toEqual([{ id: 1, leaving: false }])
    expect(time.timers).toHaveLength(0)
  })

  it('removes a toast when its dismiss timer fires', async () => {
    const { toast, notifications, time } = await load()
    toast.initToast()
    notifications.set([notify(1)])

    time.timers[0]?.()

    expect(visible(toast.toasts.peek())).toEqual([{ id: 1, leaving: true }])
  })

  it('drops the oldest toast once more than the maximum are showing', async () => {
    const { toast, notifications } = await load()
    toast.initToast()

    const counts = [...Array(6)].map((_, index) => index + 1)
    counts.forEach((count) =>
      notifications.set([...Array(count)].map((_, index) => notify(index + 1))),
    )

    const living = toast.toasts.peek().filter((entry) => !entry.leaving)
    expect(living.map((entry) => entry.id)).toEqual([2, 3, 4, 5, 6])
    expect(toast.toasts.peek().find((entry) => entry.id === 1)?.leaving).toBe(true)
  })

  it('still enforces the cap when a leaving toast is revived', async () => {
    const { toast, notifications } = await load()
    toast.initToast()

    const counts = [...Array(6)].map((_, index) => index + 1)
    counts.forEach((count) =>
      notifications.set([...Array(count)].map((_, index) => notify(index + 1))),
    )

    notifications.set([2, 3, 4, 5, 6].map((id) => notify(id)))
    notifications.set([1, 2, 3, 4, 5, 6].map((id) => notify(id)))

    const living = toast.toasts.peek().filter((entry) => !entry.leaving)
    expect(living).toHaveLength(5)
    expect(living.some((entry) => entry.id === 1)).toBe(true)
  })
})

describe('removeToast', () => {
  it('is a no-op for an unknown or already-leaving toast', async () => {
    const { toast, notifications, time } = await load()
    toast.initToast()
    notifications.set([notify(1)])

    const beforeUnknown = time.timers.length
    toast.removeToast(999)
    expect(time.timers).toHaveLength(beforeUnknown)

    toast.removeToast(1)
    const afterFirst = time.timers.length
    toast.removeToast(1)
    expect(time.timers).toHaveLength(afterFirst)
  })
})

describe('setHeight', () => {
  it('records a measured height and drops it when the toast is removed', async () => {
    const { toast, notifications, time } = await load()
    toast.initToast()
    notifications.set([notify(1)])

    toast.setHeight(1, 90)
    expect(toast.heights.peek().get(1)).toBe(90)

    notifications.set([])
    time.timers.at(-1)?.()

    expect(toast.heights.peek().has(1)).toBe(false)
  })

  it('ignores a non-positive measured height so the default fallback stands', async () => {
    const { toast, notifications } = await load()
    toast.initToast()
    notifications.set([notify(1)])

    toast.setHeight(1, 0)
    expect(toast.heights.peek().has(1)).toBe(false)

    toast.setHeight(1, 80)
    expect(toast.heights.peek().get(1)).toBe(80)
  })
})

describe('setExpand', () => {
  it('pauses dismiss timers while expanded and resumes on collapse', async () => {
    const { toast, notifications, time } = await load()
    toast.initToast()
    notifications.set([notify(1)])
    expect(time.timers).toHaveLength(1)

    toast.setExpand(true)
    expect(time.cancelled).toHaveLength(1)

    toast.setExpand(false)
    expect(time.timers).toHaveLength(2)
  })

  it('does not arm auto-dismiss for a toast that arrives while expanded, until it collapses', async () => {
    const { toast, notifications, time } = await load()
    toast.initToast()
    toast.setExpand(true)

    notifications.set([notify(1)])
    expect(time.timers).toHaveLength(0)

    toast.setExpand(false)
    expect(time.timers).toHaveLength(1)
  })

  it('resets the expanded state once the stack empties', async () => {
    const { toast, notifications, time } = await load()
    toast.initToast()
    notifications.set([notify(1)])
    toast.setExpand(true)
    expect(toast.expanded.peek()).toBe(true)

    notifications.set([])
    time.timers.at(-1)?.()

    expect(toast.expanded.peek()).toBe(false)
  })
})

describe('activateToast', () => {
  it('activates the notification and dismisses its toast', async () => {
    const { toast, notifications, activate } = await load()
    toast.initToast()
    notifications.set([notify(1)])

    toast.activateToast(1)

    expect(activate).toHaveBeenCalledTimes(1)
    expect(activate).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }))
    expect(visible(toast.toasts.peek())).toEqual([{ id: 1, leaving: true }])
  })

  it('does not activate when the notification is already gone', async () => {
    const { toast, notifications, activate } = await load()
    toast.initToast()
    notifications.set([notify(1)])
    notifications.set([])

    toast.activateToast(1)

    expect(activate).not.toHaveBeenCalled()
  })
})
