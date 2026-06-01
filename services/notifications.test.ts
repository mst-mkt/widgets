import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import { emit, reset, setMockNotifications } from '../mocks/gi-notifd'
import {
  hasNotifications,
  initNotifications,
  notifications,
  setNotifications,
  sortByTime,
  toNotification,
  type Notification,
} from './notifications'

vi.mock('ags', () => import('../mocks/ags'))

vi.mock('gi://AstalNotifd', () => import('../mocks/gi-notifd'))

const createNotification = (overrides: Partial<Notification> = {}): Notification => ({
  id: 1,
  appName: 'App',
  summary: 'summary',
  body: 'body',
  time: 100,
  ...overrides,
})

describe('toNotification', () => {
  it('maps the daemon getters into a plain object', () => {
    const source = createNotification({ id: 7, appName: 'Slack' })

    const notification = toNotification(source)

    expect(notification).toEqual({
      id: 7,
      appName: 'Slack',
      summary: 'summary',
      body: 'body',
      time: 100,
    })
  })
})

describe('sortByTime', () => {
  it('sorts newest first, breaking ties by id descending', () => {
    const input = [
      createNotification({ id: 1, time: 100 }),
      createNotification({ id: 2, time: 300 }),
      createNotification({ id: 3, time: 300 }),
    ]

    const sorted = sortByTime(input)

    expect(sorted.map((n) => n.id)).toEqual([3, 2, 1])
  })

  it('does not mutate the input', () => {
    const input = [
      createNotification({ id: 1, time: 100 }),
      createNotification({ id: 2, time: 200 }),
    ]

    sortByTime(input)

    expect(input.map((n) => n.id)).toEqual([1, 2])
  })
})

describe('initNotifications', () => {
  beforeEach(() => {
    reset()
    setNotifications([])
  })

  it('syncs the daemon notifications into state, sorted newest first', () => {
    setMockNotifications([
      createNotification({ id: 1, time: 100 }),
      createNotification({ id: 2, time: 300 }),
    ])

    initNotifications()

    expect(notifications.peek().map((n) => n.id)).toEqual([2, 1])
    expect(hasNotifications.peek()).toBe(true)
  })

  it('re-syncs when the daemon emits notified', () => {
    initNotifications()
    setMockNotifications([createNotification({ id: 5, time: 100 })])

    emit('notified')

    expect(notifications.peek().map((n) => n.id)).toEqual([5])
  })

  it('re-syncs when the daemon emits resolved', () => {
    setMockNotifications([createNotification({ id: 5, time: 100 })])
    initNotifications()
    setMockNotifications([])

    emit('resolved')

    expect(notifications.peek()).toEqual([])
  })

  it('reports no notifications on an empty daemon', () => {
    initNotifications()

    expect(hasNotifications.peek()).toBe(false)
  })
})
