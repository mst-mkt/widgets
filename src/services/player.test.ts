import AstalMpris from 'gi://AstalMpris'
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import {
  actions,
  createPlayer,
  emit,
  notify,
  PlaybackStatus,
  reset,
  setMockPlayers,
} from '../../test/mocks/gi-mpris'

vi.mock('ags', () => import('../../test/mocks/ags'))

vi.mock('gi://AstalMpris', () => import('../../test/mocks/gi-mpris'))

const {
  matchesTarget,
  readPlayer,
  initPlayer,
  available,
  title,
  isPlaying,
  playPause,
  next,
  previous,
} = await import('./player')

const SPOTIFYD = 'org.mpris.MediaPlayer2.spotifyd.instance390277'

const source = (playbackStatus: AstalMpris.PlaybackStatus): Parameters<typeof readPlayer>[0] => ({
  title: 'Song',
  artist: 'Artist',
  coverArt: '/tmp/cover.png',
  artUrl: 'https://i.scdn.co/image/abc',
  canGoNext: true,
  canGoPrevious: false,
  playbackStatus,
})

describe('matchesTarget', () => {
  it('matches the instance-suffixed spotifyd bus name', () => {
    expect(matchesTarget('org.mpris.MediaPlayer2.spotifyd.instance390277')).toBe(true)
    expect(matchesTarget('org.mpris.MediaPlayer2.spotifyd')).toBe(true)
  })

  it('does not match a different player', () => {
    expect(matchesTarget('org.mpris.MediaPlayer2.spotify')).toBe(false)
    expect(matchesTarget('org.mpris.MediaPlayer2.firefox')).toBe(false)
  })
})

describe('readPlayer', () => {
  it('maps player fields and marks it available', () => {
    expect(readPlayer(source(AstalMpris.PlaybackStatus.PLAYING))).toEqual({
      available: true,
      title: 'Song',
      artist: 'Artist',
      coverArt: '/tmp/cover.png',
      artUrl: 'https://i.scdn.co/image/abc',
      canGoNext: true,
      canGoPrevious: false,
      isPlaying: true,
    })
  })

  it('is not playing when the status is paused or stopped', () => {
    expect(readPlayer(source(AstalMpris.PlaybackStatus.PAUSED)).isPlaying).toBe(false)
    expect(readPlayer(source(AstalMpris.PlaybackStatus.STOPPED)).isPlaying).toBe(false)
  })
})

describe('initPlayer', () => {
  beforeEach(reset)

  it('binds to the spotifyd player and exposes its state', () => {
    setMockPlayers([
      createPlayer({ busName: SPOTIFYD, title: 'Song', playbackStatus: PlaybackStatus.PLAYING }),
    ])

    initPlayer()

    expect(available.peek()).toBe(true)
    expect(title.peek()).toBe('Song')
    expect(isPlaying.peek()).toBe(true)
  })

  it('stays empty when no spotifyd player is present', () => {
    setMockPlayers([createPlayer({ busName: 'org.mpris.MediaPlayer2.firefox', title: 'Tab' })])

    initPlayer()

    expect(available.peek()).toBe(false)
    expect(title.peek()).toBe('')
  })

  it('re-syncs state when the bound player emits a notify signal', () => {
    const player = createPlayer({ busName: SPOTIFYD, title: 'Old' })
    setMockPlayers([player])
    initPlayer()

    player.title = 'New'
    notify(player)

    expect(title.peek()).toBe('New')
  })

  it('binds to a spotifyd player added after init', () => {
    initPlayer()
    expect(available.peek()).toBe(false)

    setMockPlayers([createPlayer({ busName: SPOTIFYD, title: 'Late' })])
    emit('player-added')

    expect(available.peek()).toBe(true)
    expect(title.peek()).toBe('Late')
  })

  it('clears state when the player closes', () => {
    setMockPlayers([createPlayer({ busName: SPOTIFYD, title: 'Song' })])
    initPlayer()

    setMockPlayers([])
    emit('player-closed')

    expect(available.peek()).toBe(false)
    expect(title.peek()).toBe('')
  })

  it('stops syncing from the previous player after rebinding', () => {
    const first = createPlayer({ busName: SPOTIFYD, title: 'First' })
    setMockPlayers([first])
    initPlayer()

    const second = createPlayer({ busName: SPOTIFYD, title: 'Second' })
    setMockPlayers([second])
    emit('player-added')
    expect(title.peek()).toBe('Second')

    first.title = 'Stale'
    notify(first)

    expect(title.peek()).toBe('Second')
  })
})

describe('player actions', () => {
  beforeEach(reset)

  it('forwards play/pause, next and previous to the bound player', () => {
    setMockPlayers([createPlayer({ busName: SPOTIFYD })])
    initPlayer()

    playPause()
    next()
    previous()

    expect(actions()).toEqual(['play_pause', 'next', 'previous'])
  })

  it('are no-ops when no player is bound', () => {
    setMockPlayers([])
    initPlayer()

    playPause()
    next()
    previous()

    expect(actions()).toEqual([])
  })
})
