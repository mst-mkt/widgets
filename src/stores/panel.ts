import { createState } from 'ags'

import { focused } from '../services/workspaces'

export type PanelId = 'notification' | 'player'

const panelIds = ['notification', 'player'] as const satisfies PanelId[]
export const isPanelId = (value: string): value is PanelId => panelIds.includes(value as PanelId)

const [activePanel, setActivePanel] = createState<PanelId | null>(null)

export const isPanelOpen = (id: PanelId) => activePanel.as((active) => active === id)

export const openPanel = (id: PanelId) => setActivePanel(id)
export const closePanel = () => setActivePanel(null)
export const togglePanel = (id: PanelId) => {
  setActivePanel((active) => (active === id ? null : id))
}

export const initPanel = () => {
  let last = focused.peek()

  focused.subscribe(() => {
    if (focused.peek() === last) return
    last = focused.peek()
    closePanel()
  })
}
