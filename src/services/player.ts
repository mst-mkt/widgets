import { createState } from 'ags'
import AstalMpris from 'gi://AstalMpris'

const TARGET = 'org.mpris.MediaPlayer2.spotifyd'

export const matchesTarget = (busName: string) => busName.startsWith(TARGET)

const NOTIFY_SIGNALS = [
  'notify::title',
  'notify::artist',
  'notify::cover-art',
  'notify::art-url',
  'notify::can-go-next',
  'notify::can-go-previous',
  'notify::playback-status',
]

export type PlayerState = {
  available: boolean
  title: string
  artist: string
  coverArt: string
  artUrl: string
  canGoNext: boolean
  canGoPrevious: boolean
  isPlaying: boolean
}

const EMPTY: PlayerState = {
  available: false,
  title: '',
  artist: '',
  coverArt: '',
  artUrl: '',
  canGoNext: false,
  canGoPrevious: false,
  isPlaying: false,
}

type Source = Pick<
  AstalMpris.Player,
  'title' | 'artist' | 'coverArt' | 'artUrl' | 'canGoNext' | 'canGoPrevious' | 'playbackStatus'
>

export const readPlayer = (player: Source): PlayerState => ({
  available: true,
  title: player.title,
  artist: player.artist,
  coverArt: player.coverArt,
  artUrl: player.artUrl,
  canGoNext: player.canGoNext,
  canGoPrevious: player.canGoPrevious,
  isPlaying: player.playbackStatus === AstalMpris.PlaybackStatus.PLAYING,
})

let mpris: AstalMpris.Mpris | null = null
const getMpris = () => (mpris ??= AstalMpris.Mpris.get_default())

const [state, setState] = createState<PlayerState>(EMPTY)

export const available = state.as((s) => s.available)
export const title = state.as((s) => s.title)
export const artist = state.as((s) => s.artist)
export const coverArt = state.as((s) => s.coverArt)
export const artUrl = state.as((s) => s.artUrl)
export const canGoNext = state.as((s) => s.canGoNext)
export const canGoPrevious = state.as((s) => s.canGoPrevious)
export const isPlaying = state.as((s) => s.isPlaying)

let current: AstalMpris.Player | null = null
let handlers: number[] = []

const findPlayer = () => {
  const players = getMpris().get_players()
  return players.find((player) => matchesTarget(player.busName)) ?? null
}

const sync = () => setState(current !== null ? readPlayer(current) : EMPTY)

const bind = (player: AstalMpris.Player | null) => {
  if (current !== null) for (const id of handlers) current.disconnect(id)
  handlers = []
  current = player
  if (player !== null) handlers = NOTIFY_SIGNALS.map((signal) => player.connect(signal, sync))
  sync()
}

export const playPause = () => current?.play_pause()
export const next = () => current?.next()
export const previous = () => current?.previous()

export const initPlayer = () => {
  bind(findPlayer())
  getMpris().connect('player-added', () => bind(findPlayer()))
  getMpris().connect('player-closed', () => bind(findPlayer()))
}
