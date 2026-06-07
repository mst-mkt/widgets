import { createComputed, For } from 'ags'
import { Astal, type Gdk, Gtk } from 'ags/gtk4'
import app from 'ags/gtk4/app'

import { NotificationToast } from '../components/notification-toast/toast'
import { expanded, heights, setExpand, type Toast, toastIds, toasts } from '../stores/toast'
import { hoverState } from '../utils/controllers'
import { routeOverlayChildren } from '../utils/overlay'
import { stackHeight, TOAST_WIDTH } from '../utils/toast'
import { tweened } from '../utils/tweened'

export const NotificationToastWidget = (gdkmonitor?: Gdk.Monitor) => {
  const { BOTTOM, RIGHT } = Astal.WindowAnchor

  const expand = expanded.as((open) => (open ? 1 : 0))
  const expandTween = tweened(expand, { duration: 400 })

  const reservedHeight = createComputed(() => stackHeight(toastIds(), heights(), expandTween()))

  return (
    <window
      visible={toasts.as((list) => list.length > 0)}
      name="widgets:toast"
      namespace="widgets:toast"
      class="bg-transparent"
      gdkmonitor={gdkmonitor}
      anchor={BOTTOM | RIGHT}
      exclusivity={Astal.Exclusivity.NORMAL}
      layer={Astal.Layer.OVERLAY}
      keymode={Astal.Keymode.NONE}
      application={app}
    >
      <box
        class="m-3"
        halign={Gtk.Align.END}
        valign={Gtk.Align.END}
        widthRequest={TOAST_WIDTH}
        heightRequest={reservedHeight}
        $={hoverState(setExpand)}
      >
        <overlay $={routeOverlayChildren}>
          <box widthRequest={TOAST_WIDTH} heightRequest={reservedHeight} />
          <For each={toasts} id={(toast: Toast) => toast.id}>
            {(toast: Toast) => <NotificationToast id={toast.id} expand={expand} />}
          </For>
        </overlay>
      </box>
    </window>
  )
}
