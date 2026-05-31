import app from 'ags/gtk4/app'

import { initWorkspaces } from './services/workspaces'
import { Bar } from './widgets/bar'

import style from './style.css'

const init = [initWorkspaces]
const widgets = [Bar]

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
