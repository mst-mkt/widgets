import { createState } from 'ags'
import { type Timer, timeout } from 'ags/time'

import { activate, notifications } from '../services/notifications'
import { idDiff } from '../utils/array'

export type Toast = {
  id: number
  leaving: boolean
}

const LIFETIME = 5000
const MAX_TOASTS = 5
const EXIT_MS = 450
const CRITICAL = 2

export const [toasts, setToasts] = createState<Toast[]>([])
export const [expanded, setExpanded] = createState(false)
export const [heights, setHeights] = createState<Map<number, number>>(new Map())

export const toastIds = toasts.as((list) => list.map((toast) => toast.id))

const dismissTimers = new Map<number, Timer>()
const exitTimers = new Map<number, Timer>()

const findNotification = (id: number) =>
  notifications.peek().find((notification) => notification.id === id)
const isCritical = (id: number) => findNotification(id)?.urgency === CRITICAL

const clearDismiss = (id: number) => {
  dismissTimers.get(id)?.cancel()
  dismissTimers.delete(id)
}

const clearExit = (id: number) => {
  exitTimers.get(id)?.cancel()
  exitTimers.delete(id)
}

const scheduleDismiss = (id: number) => {
  clearDismiss(id)
  if (expanded.peek() || isCritical(id)) return

  dismissTimers.set(
    id,
    timeout(LIFETIME, () => {
      dismissTimers.delete(id)
      removeToast(id)
    }),
  )
}

export const setHeight = (id: number, height: number) => {
  if (height <= 0 || heights.peek().get(id) === height) return
  setHeights((current) => new Map(current).set(id, height))
}

export const removeToast = (id: number) => {
  clearDismiss(id)
  if (!toasts.peek().some((toast) => toast.id === id && !toast.leaving)) return

  setToasts((list) => list.map((toast) => (toast.id === id ? { ...toast, leaving: true } : toast)))

  clearExit(id)
  exitTimers.set(
    id,
    timeout(EXIT_MS, () => {
      exitTimers.delete(id)
      setToasts((list) => list.filter((toast) => toast.id !== id))
      setHeights((current) => {
        const next = new Map(current)
        next.delete(id)
        return next
      })
      if (toasts.peek().length === 0) setExpanded(false)
    }),
  )
}

const enforceCap = () => {
  const living = toasts.peek().filter((toast) => !toast.leaving)
  const [oldest] = living
  if (living.length > MAX_TOASTS && oldest !== undefined) removeToast(oldest.id)
}

const addToast = (id: number) => {
  const existing = toasts.peek().find((toast) => toast.id === id)
  if (existing !== undefined) {
    if (existing.leaving) {
      clearExit(id)
      setToasts((list) => [...list.filter((toast) => toast.id !== id), { id, leaving: false }])
      scheduleDismiss(id)
      enforceCap()
    }
    return
  }

  setToasts((list) => [...list, { id, leaving: false }])
  scheduleDismiss(id)
  enforceCap()
}

export const activateToast = (id: number) => {
  const notification = findNotification(id)
  if (notification !== undefined) activate(notification)
  removeToast(id)
}

const pauseTimers = () => {
  for (const id of dismissTimers.keys()) {
    clearDismiss(id)
  }
}

const resumeTimers = () => {
  for (const toast of toasts.peek()) {
    if (!toast.leaving) scheduleDismiss(toast.id)
  }
}

export const setExpand = (on: boolean) => {
  const toggleTimers = on ? pauseTimers : resumeTimers

  setExpanded(on)
  toggleTimers()
}

export const initToast = () => {
  let known = notifications.peek().map((notification) => notification.id)

  notifications.subscribe(() => {
    const next = notifications.peek().map((notification) => notification.id)
    const { added, removed } = idDiff(known, next)

    for (const id of added) {
      addToast(id)
    }
    for (const id of removed) {
      removeToast(id)
    }

    known = next
  })
}
