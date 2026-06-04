export type MockApp = {
  name: string
  entry: string
  description: string
  iconName: string
  executable: string
  keywords: string[]
  frequency: number
  launch: () => void
}

type Store = {
  apps: MockApp[]
  launched: string[]
  queries: string[]
}

const state: Store = { apps: [], launched: [], queries: [] }

const defaults = (): Omit<MockApp, 'launch'> => ({
  name: '',
  entry: '',
  description: '',
  iconName: '',
  executable: '',
  keywords: [],
  frequency: 0,
})

export const setMockApps = (apps: Partial<MockApp>[]) => {
  state.apps = apps.map((overrides) => {
    const app: MockApp = { ...defaults(), launch: () => {}, ...overrides }
    app.launch = () => {
      state.launched.push(app.entry)
      app.frequency += 1
    }
    return app
  })
}

export const launched = () => state.launched
export const queries = () => state.queries

export const reset = () => {
  state.apps = []
  state.launched = []
  state.queries = []
}

const matches = (app: MockApp, search: string) => {
  const query = search.toLowerCase()
  return (
    app.name.toLowerCase().includes(query) ||
    app.keywords.some((keyword) => keyword.toLowerCase().includes(query))
  )
}

class Apps {
  get_list() {
    return state.apps
  }

  fuzzy_query(search: string | null) {
    state.queries.push(search ?? '')
    if (search === null || search === '') return state.apps
    return state.apps.filter((app) => matches(app, search))
  }
}

export default { Apps }
