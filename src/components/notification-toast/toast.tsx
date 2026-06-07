import { createComputed, createState, type Accessor } from 'ags'
import { Gtk } from 'ags/gtk4'

import { notifications } from '../../services/notifications'
import { heights, removeToast, setHeight, toastIds, toasts } from '../../stores/toast'
import { compose, onSwipe } from '../../utils/controllers'
import { clamp } from '../../utils/math'
import { depthOf, SCALE_STEP, stackOffset, TOAST_WIDTH, VISIBLE_TOASTS } from '../../utils/toast'
import { tweened } from '../../utils/tweened'
import type { FC } from '../../utils/types'
import { NotificationToastCard } from './card'

const SWIPE_THRESHOLD = 96
const SWIPE_OFF = TOAST_WIDTH + 48

type NotificationToastProps = {
  id: number
  expand: Accessor<number>
}

export const NotificationToast: FC<NotificationToastProps> = ({ id, expand }) => {
  const initial = notifications.peek().find((notification) => notification.id === id)
  const current = notifications.as(
    (list) => list.find((notification) => notification.id === id) ?? initial,
  )

  const depth = toastIds.as((list) => depthOf(list, id))

  const offsetY = createComputed(() => stackOffset(toastIds(), heights(), id, expand()))
  const slideY = tweened(offsetY, { duration: 400 })

  const targetScale = createComputed(() => 1 - depth() * SCALE_STEP * (1 - expand()))
  const scale = tweened(targetScale, { duration: 400 })

  const [mounted, setMounted] = createState(false)
  const targetOpacity = createComputed(() => {
    const toast = toasts().find((entry) => entry.id === id)
    if (toast === undefined || toast.leaving || !mounted()) return 0

    return depth() < VISIBLE_TOASTS - 0.5 ? 1 : expand()
  })
  const opacity = tweened(targetOpacity, { duration: 450 })

  const [swipeTarget, setSwipeTarget] = createState(0)
  const slideX = tweened(swipeTarget, { duration: 120 })

  const style = createComputed(
    () =>
      `transform-origin: 50% 100%; transform: translate(${slideX()}px, ${slideY()}px) scale(${scale()}); opacity: ${clamp(opacity(), 0, 1)};`,
  )

  const onMap = (self: Gtk.Widget) =>
    self.connect('map', () => {
      setMounted(true)
      setHeight(id, self.measure(Gtk.Orientation.VERTICAL, TOAST_WIDTH)[1])
    })

  const swipeControls = onSwipe({
    move: (dx) => setSwipeTarget(Math.max(0, dx)),
    end: (dx) => {
      if (dx > SWIPE_THRESHOLD) {
        setSwipeTarget(SWIPE_OFF)
        removeToast(id)
      } else {
        setSwipeTarget(0)
      }
    },
  })

  return (
    <box
      $type="overlay"
      halign={Gtk.Align.END}
      valign={Gtk.Align.END}
      css={style}
      $={compose(swipeControls, onMap)}
    >
      <NotificationToastCard id={id} current={current} />
    </box>
  )
}
