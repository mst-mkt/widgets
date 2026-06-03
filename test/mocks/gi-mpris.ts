import { vi } from 'vite-plus/test'

type Handler = () => void

export const PlaybackStatus = {
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  STOPPED: 'STOPPED',
}

export type MockPlayer = {
  busName: string
  title: string
  artist: string
  coverArt: string
  artUrl: string
  canGoNext: boolean
  canGoPrevious: boolean
  playbackStatus: string
  connect: (signal: string, cb: Handler) => number
  disconnect: (id: number) => void
  play_pause: () => void
  next: () => void
  previous: () => void
}

type Store = {
  players: MockPlayer[]
  handlers: Record<string, Handler[]>
  actions: string[]
}

const state: Store = {
  players: [],
  handlers: {},
  actions: [],
}

const signals = new WeakMap<MockPlayer, Map<number, Handler>>()

export const createPlayer = (overrides: Partial<MockPlayer> = {}): MockPlayer => {
  const connected = new Map<number, Handler>()
  let nextId = 1

  const player: MockPlayer = {
    busName: 'org.mpris.MediaPlayer2.spotifyd',
    title: '',
    artist: '',
    coverArt: '',
    artUrl: '',
    canGoNext: false,
    canGoPrevious: false,
    playbackStatus: PlaybackStatus.STOPPED,
    connect: (_signal, cb) => {
      const id = nextId++
      connected.set(id, cb)
      return id
    },
    disconnect: (id) => {
      connected.delete(id)
    },
    play_pause: () => state.actions.push('play_pause'),
    next: () => state.actions.push('next'),
    previous: () => state.actions.push('previous'),
    ...overrides,
  }

  signals.set(player, connected)
  return player
}

const mpris = {
  get_players: () => state.players,
  connect: vi.fn((signal: string, cb: Handler) => {
    state.handlers[signal] ??= []
    state.handlers[signal].push(cb)
    return 0
  }),
}

export const setMockPlayers = (players: MockPlayer[]) => {
  state.players = players
}

export const notify = (player: MockPlayer) => {
  for (const cb of signals.get(player)?.values() ?? []) {
    cb()
  }
}

export const emit = (signal: string) => {
  for (const cb of state.handlers[signal] ?? []) {
    cb()
  }
}

export const actions = () => state.actions

export const reset = () => {
  state.players = []
  state.handlers = {}
  state.actions = []
}

export default {
  PlaybackStatus,
  Mpris: { get_default: () => mpris },
}
