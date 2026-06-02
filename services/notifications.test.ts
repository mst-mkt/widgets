import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import { emit, invocations, reset, setMockNotifications } from '../mocks/gi-notifd'
import {
  activate,
  groupByApp,
  groupKey,
  hasDefaultAction,
  hasNotifications,
  initNotifications,
  interactiveActions,
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
  appIcon: '',
  desktopEntry: '',
  summary: 'summary',
  body: 'body',
  image: '',
  urgency: 1,
  time: 100,
  actions: [],
  ...overrides,
})

describe('toNotification', () => {
  it('maps the daemon getters into a plain object', () => {
    const source = createNotification({ id: 7, appName: 'Slack' })

    expect(toNotification(source)).toEqual(source)
  })

  it('copies actions into fresh objects', () => {
    const source = createNotification({ actions: [{ id: 'a', label: 'A' }] })

    const notification = toNotification(source)

    expect(notification.actions).toEqual([{ id: 'a', label: 'A' }])
    expect(notification.actions[0]).not.toBe(source.actions[0])
  })
})

describe('sortByTime', () => {
  it('sorts newest first, breaking ties by id descending', () => {
    const input = [
      createNotification({ id: 1, time: 100 }),
      createNotification({ id: 2, time: 300 }),
      createNotification({ id: 3, time: 300 }),
    ]

    expect(sortByTime(input).map((n) => n.id)).toEqual([3, 2, 1])
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

describe('groupByApp', () => {
  it('lists each app once, preserving first-seen order', () => {
    const groups = groupByApp([
      createNotification({ id: 1, appName: 'Slack' }),
      createNotification({ id: 2, appName: 'Spotify' }),
      createNotification({ id: 3, appName: 'Slack' }),
    ])

    expect(groups.map((g) => g.appName)).toEqual(['Slack', 'Spotify'])
  })

  it('uses the first non-empty appIcon of a group', () => {
    const groups = groupByApp([
      createNotification({ id: 1, appName: 'A', appIcon: '' }),
      createNotification({ id: 2, appName: 'A', appIcon: 'a-icon' }),
      createNotification({ id: 3, appName: 'A', appIcon: 'other' }),
    ])

    expect(groups[0]?.appIcon).toBe('a-icon')
  })

  it('falls back to an empty appIcon when none is set', () => {
    expect(groupByApp([createNotification({ appName: 'A' })])[0]?.appIcon).toBe('')
  })

  it('uses the first non-empty desktopEntry of a group', () => {
    const groups = groupByApp([
      createNotification({ id: 1, appName: 'A', desktopEntry: '' }),
      createNotification({ id: 2, appName: 'A', desktopEntry: 'org.a.App' }),
    ])

    expect(groups[0]?.desktopEntry).toBe('org.a.App')
  })

  it('keeps apps with empty appName apart by their desktopEntry', () => {
    const groups = groupByApp([
      createNotification({ id: 1, appName: '', desktopEntry: 'discord' }),
      createNotification({ id: 2, appName: '', desktopEntry: 'slack' }),
    ])

    expect(groups.map((g) => g.key)).toEqual(['discord', 'slack'])
  })
})

describe('groupKey', () => {
  it('prefers appName, falling back to desktopEntry', () => {
    expect(groupKey(createNotification({ appName: 'A', desktopEntry: 'org.a' }))).toBe('A')
    expect(groupKey(createNotification({ appName: '', desktopEntry: 'org.a' }))).toBe('org.a')
  })
})

describe('interactiveActions', () => {
  it('drops the default action', () => {
    const actions = [
      { id: 'default', label: 'Open' },
      { id: 'reply', label: 'Reply' },
    ]

    expect(interactiveActions(actions)).toEqual([{ id: 'reply', label: 'Reply' }])
  })
})

describe('hasDefaultAction', () => {
  it('detects the default action', () => {
    expect(hasDefaultAction([{ id: 'default', label: 'Open' }])).toBe(true)
    expect(hasDefaultAction([{ id: 'reply', label: 'Reply' }])).toBe(false)
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

describe('activate', () => {
  beforeEach(reset)

  it('invokes the default action when the notification has one', () => {
    setMockNotifications([createNotification({ id: 3 })])

    activate(createNotification({ id: 3, actions: [{ id: 'default', label: 'Open' }] }))

    expect(invocations()).toEqual([[3, 'default']])
  })

  it('does nothing when there is no default action', () => {
    setMockNotifications([createNotification({ id: 4 })])

    activate(createNotification({ id: 4, actions: [{ id: 'reply', label: 'Reply' }] }))

    expect(invocations()).toEqual([])
  })
})
