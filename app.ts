import app from 'ags/gtk4/app'

import { initClock } from './services/clock'
import { initNotifications } from './services/notifications'
import { initWorkspaces } from './services/workspaces'
import { initPanel } from './stores/panel'
import { Bar } from './widgets/bar'
import { NotificationPanelWidget } from './widgets/notification-panel'

import style from './style.css'

const init = [initWorkspaces, initNotifications, initClock, initPanel]
const widgets = [Bar, NotificationPanelWidget]

app.start({
  css: style,
  main: () => {
    for (const start of init) start()

    for (const widget of widgets) {
      for (const monitor of app.get_monitors()) {
        widget(monitor)
      }
    }
  },
})
