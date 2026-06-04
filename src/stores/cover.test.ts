import { describe, expect, it, vi } from 'vite-plus/test'

import { textures } from '../../test/mocks/ags-gtk4'
import { flush } from '../../test/mocks/gi-soup'

vi.mock('ags', () => import('../../test/mocks/ags'))

vi.mock('gi://GLib', () => import('../../test/mocks/gi-glib'))

vi.mock('ags/gtk4', () => import('../../test/mocks/ags-gtk4'))

vi.mock('gi://Soup', () => import('../../test/mocks/gi-soup'))

const player = await vi.hoisted(async () => {
  const { reactive } = await import('../../test/mocks/reactive')
  return { coverArt: reactive(''), artUrl: reactive('') }
})

vi.mock('../services/player', () => ({
  coverArt: player.coverArt.accessor,
  artUrl: player.artUrl.accessor,
}))

const { cover } = await import('./cover')

cover.subscribe(() => {})

describe('cover store', () => {
  it('resolves a local cover-art path to a file texture', () => {
    player.artUrl.set('')
    player.coverArt.set('/tmp/cover.png')

    expect(cover.peek()).toBe(textures.file)
  })

  it('fetches the http art url and decodes the response bytes', () => {
    player.coverArt.set('')
    player.artUrl.set('https://i.scdn.co/image/abc')
    flush()

    expect(cover.peek()).toBe(textures.bytes)
  })

  it('clears the cover when neither a file nor an http url is available', () => {
    player.coverArt.set('')
    player.artUrl.set('spotify:track:xyz')

    expect(cover.peek()).toBeNull()
  })

  it('discards an in-flight remote response after the track switches to a file', () => {
    player.coverArt.set('')
    player.artUrl.set('https://i.scdn.co/image/abc')

    player.artUrl.set('')
    player.coverArt.set('/tmp/next.png')
    expect(cover.peek()).toBe(textures.file)

    flush()

    expect(cover.peek()).toBe(textures.file)
  })
})
