import app from 'ags/gtk4/app'

import { handleRequest } from './handler'
import { initBrightness } from './services/brightness'
import { initClock } from './services/clock'
import { initNotifications } from './services/notifications'
import { initWorkspaces } from './services/workspaces'
import { initOsd } from './stores/osd'
import { initPanel } from './stores/panel'
import { Bar } from './widgets/bar'
import { NotificationPanelWidget } from './widgets/notification-panel'
import { Osd } from './widgets/osd'

import style from './style.css'

const init = [initWorkspaces, initNotifications, initClock, initBrightness, initPanel, initOsd]
const widgets = [Bar, NotificationPanelWidget, Osd]

app.start({
  css: style,
  requestHandler: (argv, res) => res(handleRequest(argv)),
  main: () => {
    for (const start of init) start()

    for (const widget of widgets) {
      for (const monitor of app.get_monitors()) {
        widget(monitor)
      }
    }
  },
})
