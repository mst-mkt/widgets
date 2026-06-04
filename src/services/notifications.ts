import { createState } from 'ags'
import AstalNotifd from 'gi://AstalNotifd'

export type NotificationAction = {
  id: string
  label: string
}

export type Notification = {
  id: number
  appName: string
  appIcon: string
  desktopEntry: string
  summary: string
  body: string
  image: string
  urgency: number
  time: number
  actions: NotificationAction[]
}

export type AppGroup = {
  key: string
  appName: string
  appIcon: string
  desktopEntry: string
}

type Source = Pick<
  AstalNotifd.Notification,
  'id' | 'appName' | 'appIcon' | 'desktopEntry' | 'summary' | 'body' | 'image' | 'urgency' | 'time'
> & {
  actions: { id: string; label: string }[]
}

export const toNotification = (source: Source) => {
  return {
    id: source.id,
    appName: source.appName,
    appIcon: source.appIcon,
    desktopEntry: source.desktopEntry,
    summary: source.summary,
    body: source.body,
    image: source.image,
    urgency: source.urgency,
    time: source.time,
    actions: source.actions.map((action) => ({ id: action.id, label: action.label })),
  } satisfies Notification
}

export const sortByTime = (notifications: Notification[]) => {
  return notifications.toSorted((a, b) => b.time - a.time || b.id - a.id)
}

export const groupKey = (notification: Notification) => {
  return notification.appName || notification.desktopEntry
}

export const groupByApp = (notifications: Notification[]): AppGroup[] => {
  const keys = [...new Set(notifications.map(groupKey))]

  return keys.map((key) => {
    const grouped = notifications.filter((notification) => groupKey(notification) === key)
    const withName = grouped.find((notification) => notification.appName !== '')
    const withIcon = grouped.find((notification) => notification.appIcon !== '')
    const withEntry = grouped.find((notification) => notification.desktopEntry !== '')

    return {
      key,
      appName: withName?.appName ?? '',
      appIcon: withIcon?.appIcon ?? '',
      desktopEntry: withEntry?.desktopEntry ?? '',
    }
  })
}

export const interactiveActions = (actions: NotificationAction[]) => {
  return actions.filter((action) => action.id !== 'default')
}

export const hasDefaultAction = (actions: NotificationAction[]) => {
  return actions.some((action) => action.id === 'default')
}

let notifd: AstalNotifd.Notifd | null = null
const getNotifd = () => (notifd ??= AstalNotifd.get_default())

export const [notifications, setNotifications] = createState<Notification[]>([])

export const groups = notifications.as(groupByApp)
export const hasNotifications = notifications.as((list) => list.length > 0)

const sync = () => setNotifications(sortByTime(getNotifd().get_notifications().map(toNotification)))

export const initNotifications = () => {
  sync()
  getNotifd().connect('notified', sync)
  getNotifd().connect('resolved', sync)
}

export const dismissAll = () => {
  getNotifd()
    .get_notifications()
    .forEach((notification) => notification.dismiss())
}

export const invoke = (id: number, actionId: string) => {
  getNotifd().get_notification(id)?.invoke(actionId)
}

export const activate = (notification: Notification) => {
  if (hasDefaultAction(notification.actions)) invoke(notification.id, 'default')
}
