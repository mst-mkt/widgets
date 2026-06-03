import { vi } from 'vite-plus/test'

type Handler = () => void

type Store = {
  values: number[]
  handlers: Record<string, Handler[]>
}

const state: Store = {
  values: [],
  handlers: {},
}

const cava = {
  active: true,
  bars: 20,
  get_values: () => state.values,
  connect: vi.fn((signal: string, cb: Handler) => {
    state.handlers[signal] ??= []
    state.handlers[signal].push(cb)
    return 0
  }),
}

export const instance = () => cava

export const setValues = (values: number[]) => {
  state.values = values
}

export const emit = (signal: string) => {
  for (const cb of state.handlers[signal] ?? []) {
    cb()
  }
}

export const reset = () => {
  state.values = []
  state.handlers = {}
  cava.active = true
  cava.bars = 20
}

export default {
  get_default: () => cava,
}
