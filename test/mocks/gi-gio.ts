type MockIcon = {
  to_string: () => string | null
}

type MockAppInfo = {
  get_id: () => string
  get_name: () => string
  get_icon: () => MockIcon | null
}

const state: { apps: MockAppInfo[] } = {
  apps: [],
}

export const setMockApps = (apps: MockAppInfo[]) => {
  state.apps = apps
}

export const reset = () => {
  state.apps = []
}

export default {
  app_info_get_all: () => state.apps,
}
