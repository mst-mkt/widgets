import app from 'ags/gtk4/app'

import { handleRequest } from './handler'
import { initBrightness } from './services/brightness'
import { initCava } from './services/cava'
import { initClock } from './services/clock'
import { initNotifications } from './services/notifications'
import { initPlayer } from './services/player'
import { initWorkspaces } from './services/workspaces'
import { initCover } from './stores/cover'
import { initOsd } from './stores/osd'
import { initPanel } from './stores/panel'
import { BarWidget } from './widgets/bar'
import { NotificationPanelWidget } from './widgets/notification-panel'
import { OsdWidget } from './widgets/osd'
import { PlayerPanelWidget } from './widgets/player-panel'

import style from './style.css'

const serviceInits = [
  initWorkspaces,
  initNotifications,
  initClock,
  initBrightness,
  initPlayer,
  initCava,
  initCover,
  initPanel,
  initOsd,
]
const widgets = [BarWidget, NotificationPanelWidget, PlayerPanelWidget, OsdWidget]

app.start({
  css: style,
  requestHandler: (argv, res) => res(handleRequest(argv)),
  main: () => {
    for (const start of serviceInits) start()

    for (const widget of widgets) {
      for (const monitor of app.get_monitors()) {
        widget(monitor)
      }
    }
  },
})
