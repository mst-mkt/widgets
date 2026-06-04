import AstalApps from 'gi://AstalApps'

export type AppEntry = {
  name: string
  description: string
  icon: string
  entry: string
}

type Source = Pick<AstalApps.Application, 'name' | 'entry'> & {
  description: string | null
  iconName: string | null
}
type Ranked = Pick<AstalApps.Application, 'frequency' | 'name'>

const apps = new AstalApps.Apps({
  nameMultiplier: 2,
  entryMultiplier: 1,
  executableMultiplier: 0.5,
  keywordsMultiplier: 0.5,
})

export const toEntry = (app: Source): AppEntry => ({
  name: app.name,
  description: app.description ?? '',
  icon: app.iconName ?? '',
  entry: app.entry,
})

export const byFrequency = (a: Ranked, b: Ranked) => {
  return b.frequency - a.frequency || a.name.localeCompare(b.name)
}

export const search = (text: string): AppEntry[] => {
  const query = text.trim()
  const matched = query === '' ? apps.get_list().toSorted(byFrequency) : apps.fuzzy_query(query)
  return matched.map(toEntry)
}

export const launch = (entry: string) => {
  const appList = apps.get_list()
  const app = appList.find((app) => app.entry === entry)
  app?.launch()
}
