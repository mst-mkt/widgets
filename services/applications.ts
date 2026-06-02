import Gio from 'gi://Gio'

export type DesktopApp = {
  name: string
  icon: string
}

export type AppIdentity = {
  name: string
  icon: string
}

type AppSource = {
  appName: string
  appIcon: string
  desktopEntry: string
}

export const resolveApp = (appSource: AppSource) => {
  const app = desktopApp(appSource.desktopEntry)

  return {
    name: app?.name || appSource.appName,
    icon: appSource.appIcon || app?.icon || '',
  } satisfies AppIdentity
}

export const desktopId = (entry: string) => {
  return entry.endsWith('.desktop') ? entry : `${entry}.desktop`
}

const cache = new Map<string, DesktopApp | null>()

const lookup = (entry: string) => {
  const id = desktopId(entry)
  const info = Gio.app_info_get_all().find((app) => app.get_id() === id)

  if (info === undefined) return null

  return {
    name: info.get_name(),
    icon: info.get_icon()?.to_string() ?? '',
  } satisfies DesktopApp
}

export const desktopApp = (entry: string) => {
  if (entry === '') return null

  const cached = cache.get(entry)
  if (cached !== undefined) return cached

  const resolved = lookup(entry)
  cache.set(entry, resolved)

  return resolved
}
