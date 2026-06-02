import { closePanel, isPanelId, openPanel, togglePanel } from './stores/panel'

type Handler = (argv: string[]) => string

const handlers = {
  close: () => {
    closePanel()
    return 'ok'
  },
  toggle: ([id, ...restArgs]) => {
    if (id !== undefined && isPanelId(id)) {
      togglePanel(id)
      return 'ok'
    }
    return `unknown request: ${id} ${restArgs.join(' ')}`
  },
  open: ([id, ...restArgs]) => {
    if (id !== undefined && isPanelId(id)) {
      openPanel(id)
      return 'ok'
    }
    return `unknown request: ${id} ${restArgs.join(' ')}`
  },
} as const satisfies Record<string, Handler>

const isHandler = (value: string): value is keyof typeof handlers => value in handlers

export const handleRequest = (argv: string[]) => {
  const [command, ...restArgs] = argv

  if (command === undefined || !isHandler(command)) {
    return `unknown request: ${command} ${restArgs.join(' ')}`
  }

  return handlers[command](restArgs)
}
