import { createState } from 'ags'
import AstalNotifd from 'gi://AstalNotifd'

export type Notification = {
  id: number
  appName: string
  summary: string
  body: string
  time: number
}

type Source = Pick<AstalNotifd.Notification, 'id' | 'appName' | 'summary' | 'body' | 'time'>

export const toNotification = (source: Source) => {
  return {
    id: source.id,
    appName: source.appName,
    summary: source.summary,
    body: source.body,
    time: source.time,
  } satisfies Notification
}

export const sortByTime = (notifications: Notification[]) => {
  return notifications.toSorted((a, b) => b.time - a.time || b.id - a.id)
}

const notifd = AstalNotifd.get_default()

export const [notifications, setNotifications] = createState<Notification[]>([])

export const hasNotifications = notifications.as((list) => list.length > 0)

const sync = () => setNotifications(sortByTime(notifd.get_notifications().map(toNotification)))

export const initNotifications = () => {
  sync()
  notifd.connect('notified', sync)
  notifd.connect('resolved', sync)
}
