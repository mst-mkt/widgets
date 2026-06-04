import { createExternal } from 'ags'
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

let current: AstalMpris.Player | null = null

const state = createExternal<PlayerState>(EMPTY, (set) => {
  const mpris = AstalMpris.Mpris.get_default()
  let unbind = () => {}

  const rebind = () => {
    unbind()
    current = mpris.get_players().find((player) => matchesTarget(player.busName)) ?? null

    if (current === null) {
      unbind = () => {}
      set(EMPTY)
      return
    }

    const player = current
    const ids = NOTIFY_SIGNALS.map((signal) =>
      player.connect(signal, () => set(readPlayer(player))),
    )
    unbind = () => {
      for (const id of ids) player.disconnect(id)
    }
    set(readPlayer(player))
  }

  rebind()
  const addedId = mpris.connect('player-added', rebind)
  const closedId = mpris.connect('player-closed', rebind)

  return () => {
    unbind()
    current = null
    mpris.disconnect(addedId)
    mpris.disconnect(closedId)
    set(EMPTY)
  }
})

export const available = state.as((s) => s.available)
export const title = state.as((s) => s.title)
export const artist = state.as((s) => s.artist)
export const coverArt = state.as((s) => s.coverArt)
export const artUrl = state.as((s) => s.artUrl)
export const canGoNext = state.as((s) => s.canGoNext)
export const canGoPrevious = state.as((s) => s.canGoPrevious)
export const isPlaying = state.as((s) => s.isPlaying)

export const playPause = () => current?.play_pause()
export const next = () => current?.next()
export const previous = () => current?.previous()
