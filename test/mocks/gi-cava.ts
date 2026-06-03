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

export const Input = {
  FIFO: 0,
  PORTAUDIO: 1,
  PIPEWIRE: 2,
  ALSA: 3,
  PULSE: 4,
}

const cava = {
  active: true,
  bars: 20,
  input: Input.PIPEWIRE,
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
  cava.input = Input.PIPEWIRE
}

export default {
  Input,
  get_default: () => cava,
}
