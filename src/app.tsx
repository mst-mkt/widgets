import { createBinding, For } from 'ags'
import { Gtk } from 'ags/gtk4'
import app from 'ags/gtk4/app'

import { handleRequest } from './handler'
import { initAudio } from './services/audio'
import { initBrightness } from './services/brightness'
import { initCava } from './services/cava'
import { initClock } from './services/clock'
import { initNotifications } from './services/notifications'
import { initPlayer } from './services/player'
import { initWorkspaces } from './services/workspaces'
import { initCover } from './stores/cover'
import { initLauncher } from './stores/launcher'
import { initOsd } from './stores/osd'
import { initPanel } from './stores/panel'
import { BarWidget } from './widgets/bar'
import { LauncherWidget } from './widgets/launcher'
import { NotificationPanelWidget } from './widgets/notification-panel'
import { OsdWidget } from './widgets/osd'
import { PlayerWidget } from './widgets/player'

import style from './style.css'

const serviceInits = [
  initWorkspaces,
  initNotifications,
  initClock,
  initBrightness,
  initAudio,
  initPlayer,
  initCava,
  initCover,
  initPanel,
  initOsd,
  initLauncher,
]

const overlayWidgets = [NotificationPanelWidget, PlayerWidget, OsdWidget, LauncherWidget]

app.start({
  css: style,
  requestHandler: (argv, res) => res(handleRequest(argv)),
  main: () => {
    for (const start of serviceInits) start()
    for (const overlay of overlayWidgets) overlay()

    const monitors = createBinding(app, 'monitors')

    return (
      <For
        each={monitors}
        cleanup={(bar) => {
          if (bar instanceof Gtk.Window) bar.destroy()
        }}
      >
        {(monitor) => BarWidget(monitor)}
      </For>
    )
  },
})
